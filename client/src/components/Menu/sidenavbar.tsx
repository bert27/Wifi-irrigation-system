import { Box, Link, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";
import { Link as LinkDom, useLocation } from "react-router-dom";
import WaterDrop from "@mui/icons-material/WaterDrop";
import LocalBarIcon from "@mui/icons-material/LocalBar";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import "./sidenavbar.css";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { NavItem } from "./models/navigation-model";
import { useConnectivity } from "@/context/connectivity-context";
import { Chip } from "@mui/material";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const iconsPages = [
  { name: "menu.robot", linkTo: "/", icon: <SmartToyIcon /> },
  { name: "menu.drinks", linkTo: "/drinks", icon: <LocalBarIcon /> },
  { name: "menu.irrigation", linkTo: "/irrigation", icon: <WaterDrop /> },
];

export const SideNavBar = (): React.ReactElement => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { getConnectionStatus } = useConnectivity();

  // Determine current context for connectivity
  const getContextInfo = () => {
    if (location.pathname.startsWith('/drinks')) return getConnectionStatus('drinks');
    if (location.pathname.startsWith('/irrigation')) return getConnectionStatus('irrigation');
    return getConnectionStatus('robot'); // Default
  };

  const connectionInfo = getContextInfo();
  const isConnected = connectionInfo.status === 'connected';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleMenuClose();
  };

  return (
    <div className="side-nav-bar">
      {iconsPages.map((iconPage: NavItem) => {
        const isActive = location.pathname === iconPage.linkTo;
        return (
          <div
            className={`nav-item ${isActive ? 'active' : ''}`}
            key={iconPage.name}
          >
            <Link
              aria-label={t(iconPage.name)}
              component={LinkDom}
              to={iconPage.linkTo}
              underline="none"
            >
              <Tooltip placement="right" title={t(iconPage.name)} arrow>
                <div className="nav-icon">
                  {iconPage.icon}
                </div>
              </Tooltip>
            </Link>
          </div>
        );
      })}

      <div className="nav-item connection-status" style={{ marginTop: 'auto', marginBottom: '0.5rem' }}>
        <Tooltip
          placement="right"
          title={connectionInfo.ip ? `IP: ${connectionInfo.ip}` : t('common.disconnected')}
          arrow
        >
          <Chip
            icon={<FiberManualRecordIcon style={{ fontSize: '0.8rem', color: isConnected ? '#4caf50' : '#f44336' }} />}
            label={connectionInfo.ip || "Offline"}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-color)',
              border: '1px solid var(--glass-border)',
              height: '24px',
              width: '100%',
              fontSize: '0.7rem',
              cursor: 'pointer',
              '& .MuiChip-label': {
                paddingLeft: '4px',
                paddingRight: '8px',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              },
              '& .MuiChip-icon': {
                marginLeft: '4px'
              },
              justifyContent: 'flex-start'
            }}
          />
        </Tooltip>
      </div>

      <div className="nav-item language-switcher" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
        <Tooltip placement="right" title={t('common.language')} arrow>
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              color: 'var(--text-color)',
              '&:hover': { background: 'rgba(255, 255, 255, 0.1)' },
              fontSize: '1.5rem'
            }}
          >
            {i18n.language.startsWith('en') ? '🇬🇧' : '🇪🇸'}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          PaperProps={{
            className: "glass-effect",
            sx: {
              background: 'var(--bg-surface) !important',
              border: '1px solid var(--glass-border) !important',
              minWidth: '150px',
              '& .MuiMenuItem-root': {
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                fontWeight: 600,
                py: 1.5,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                }
              }
            }
          }}
        >
          <MenuItem onClick={() => changeLanguage('es')}>
            <span role="img" aria-label="Español" style={{ marginRight: '8px' }}>🇪🇸</span>
            {t('common.spanish')}
          </MenuItem>
          <MenuItem onClick={() => changeLanguage('en')}>
            <span role="img" aria-label="English" style={{ marginRight: '8px' }}>🇬🇧</span>
            {t('common.english')}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};
