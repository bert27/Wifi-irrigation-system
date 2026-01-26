#pragma once

#include "../../../common/remote/RemoteControlHub.hpp"
#include "../../../common/remote/remote_protocol.hpp"
#include "../DrinksMachine.hpp"
#include "../services/MenuService.hpp"
#include "PumpsService.hpp"
#include "DisplayService.hpp"

class RemoteActionsService {
public:
    static RemoteActionsService& getInstance() {
        static RemoteActionsService instance;
        return instance;
    }

    void begin() {
        RemoteControlHub::getInstance().subscribe([this](const struct_message& msg) {
            this->processMessage(msg);
        });
        Serial.println("Service: RemoteActions Started");
    }

private:
    RemoteActionsService() {}

    void processMessage(const struct_message& msg) {
        Serial.printf("[RemoteActions] Received Message ID: %d\n", msg.id);
        
        uint8_t* targetMac = RemoteControlHub::getInstance().getLastSenderMac();
        uint8_t broadcastAddress[] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};
        
        // Decide destination: last sender or broadcast fallback
        uint8_t* dest = (targetMac[0] == 0 && targetMac[1] == 0) ? broadcastAddress : targetMac;

        // On ESP8266, we MUST add the peer before sending to a specific MAC
        if (dest != broadcastAddress) {
            if (!esp_now_is_peer_exist(dest)) {
                Serial.printf("[RemoteActions] Adding display as peer: %02X:%02X:%02X:%02X:%02X:%02X\n", 
                              dest[0], dest[1], dest[2], dest[3], dest[4], dest[5]);
                esp_now_add_peer(dest, ESP_NOW_ROLE_COMBO, 0, NULL, 0);
            }
        }

        // --- 1. SYNC REQUEST (ID 100) ---
        if (msg.id == REMOTE_CMD_SYNC_REQUEST) {
            Serial.printf("[RemoteActions] Sync request received. Target: %02X:%02X:%02X:%02X:%02X:%02X\n", 
                          dest[0], dest[1], dest[2], dest[3], dest[4], dest[5]);
            
            struct_message response;
            memset(&response, 0, sizeof(response));
            response.id = REMOTE_CMD_SYNC_RESPONSE; // ID 101
            
            auto& bottles = MenuService::getInstance().bottles;
            for (int i = 0; i < 4 && i < (int)bottles.size(); i++) {
                response.pumpValues.pwm[i] = bottles[i].pwm;
                response.pumpValues.calibration[i] = bottles[i].timeCalibration;
            }
            
            int result = esp_now_send(dest, (uint8_t *) &response, sizeof(response)); 
            Serial.printf("[RemoteActions] Sync response sent. Result: %d\n", result);
            return;
        }

        // --- 1B. RECIPE SYNC REQUEST (ID 102) ---
        if (msg.id == REMOTE_CMD_RECIPE_SYNC_REQUEST) {
             Serial.printf("[RemoteActions] Recipe sync request received. Sending to %02X:%02X:%02X:%02X:%02X:%02X\n",
                           dest[0], dest[1], dest[2], dest[3], dest[4], dest[5]);
             
             auto& menu = MenuService::getInstance().menu;
             auto& bottles = MenuService::getInstance().bottles;
             
             Serial.printf("[RemoteActions] Sending %d recipes...\n", (int)menu.size());

             for (size_t i = 0; i < menu.size(); i++) {
                 struct_message response;
                 memset(&response, 0, sizeof(response));
                 response.id = REMOTE_CMD_RECIPE_DATA; // 103

                 // Header
                 response.recipeData.index = i + 1;
                 response.recipeData.total = menu.size();
                 strncpy(response.recipeData.name, menu[i].name.c_str(), sizeof(response.recipeData.name) - 1);
                 
                 // Map Ingredients to Pumps
                 if (menu[i].isCocktail) {
                     const auto& cocktail = MenuService::getInstance().cocktails[menu[i].index];
                     for(const auto& ing : cocktail.ingredients) {
                         for(const auto& b : bottles) {
                             if (b.liquid.equalsIgnoreCase(ing.name)) {
                                 int pIndex = b.id - 1; 
                                 if (pIndex >= 0 && pIndex < 4) {
                                     response.recipeData.ingredientsMl[pIndex] = ing.quantity;
                                 }
                             }
                         }
                     }
                 } else {
                     // Single liquid: set Ml to 200 (default) for the corresponding pump
                     for(const auto& b : bottles) {
                         if (b.id == (menu[i].index + 1)) {
                             response.recipeData.ingredientsMl[b.id - 1] = 200;
                         }
                     }
                 }

                 esp_now_send(dest, (uint8_t *) &response, sizeof(response));
                 delay(50); // Prevent packet loss
             }
             Serial.printf("[RemoteActions] All recipes sent.\n");
             return;
        }

        // --- 1C. PUMP UPDATE (ID 104) ---
        if (msg.id == REMOTE_CMD_PUMP_UPDATE) {
            String cmd = String(msg.choose);
            Serial.printf("[RemoteActions] Pump update received: %s\n", cmd.c_str());
            DrinksMachine::getInstance().enqueueCommand(cmd);
            return;
        }

        // --- 1D. RECIPE UPDATE (ID 105) ---
        if (msg.id == REMOTE_CMD_RECIPE_UPDATE) {
            String name = String(msg.recipeData.name);
            Serial.printf("[RemoteActions] Recipe Update Recv: %s\n", name.c_str());
            
            std::vector<ILiquidProp> ingredients;
            auto& bottles = MenuService::getInstance().bottles;

            for (int i=0; i<4; i++) {
                uint16_t qty = msg.recipeData.ingredientsMl[i];
                if (qty > 0) {
                    // Find liquid name for Pump ID (i+1)
                    // We assume bottles are sorted by ID or we search them
                    String liquidName = "Unknown";
                    for(const auto& b : bottles) {
                         if(b.id == (i+1)) {
                             liquidName = b.liquid;
                             break;
                         }
                    }
                    if (liquidName != "Unknown") {
                        ingredients.push_back({ liquidName, (int)qty });
                    }
                }
            }

            if (!ingredients.empty()) {
                MenuService::getInstance().updateCocktail(name, ingredients);
                Serial.println("[RemoteActions] Recipe Updated & Saved.");
            } else {
                Serial.println("[RemoteActions] Error: No ingredients found/mapped.");
            }
            return;
        }

        // --- 2. DRINK ORDER (ID 99) ---
        if (msg.id == REMOTE_CMD_DRINK_ORDER) {
            String drinkName = String(msg.choose);
            Serial.printf("[RemoteActions] Drink order received: %s\n", drinkName.c_str());
            auto& menu = MenuService::getInstance().menu;
            
            // Find drink index
            int foundIndex = -1;
            for (int i = 0; i < (int)menu.size(); i++) {
                if (menu[i].name == drinkName) {
                    foundIndex = i;
                    break;
                }
            }

            if (foundIndex != -1) {
                // Delegate to DrinksMachine to start serving
                DrinksMachine::getInstance().startServing(foundIndex);
                Serial.printf("[RemoteActions] Started serving ordered drink.\n");
            } else {
                 DisplayService::getInstance().setScreen("Error", "No encontrado", 2);
                 Serial.printf("[RemoteActions] Drink not found: %s\n", drinkName.c_str());
            }
            return;
        }

        // --- 3. JOYSTICK / LEGACY ---
        // Forward joystick commands to DrinksMachine queue
        String joyDir = String(msg.joystickValues.direction);
        if (joyDir == "Arriba") DrinksMachine::getInstance().enqueueCommand("prev");
        else if (joyDir == "Abajo") DrinksMachine::getInstance().enqueueCommand("next");
        else if (joyDir == "Izquierda") DrinksMachine::getInstance().enqueueCommand("back");
        if (String(msg.joystickValues.buttonState) == "on") DrinksMachine::getInstance().enqueueCommand("select");
    }
};

inline void setupRemoteActions() {
    RemoteActionsService::getInstance().begin();
}
