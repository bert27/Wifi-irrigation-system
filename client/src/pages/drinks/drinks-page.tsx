import { ComponentTabs } from "../../components/Tabs/sidenavbar";

export const DrinksPage = (props: any) => {
  return (
    <div
      style={{
        backgroundColor: "#0B2447",
        minHeight: "100vh",
        padding: "2em",
        color: "white",
        width: "100%",
      }}
    >
      <ComponentTabs />
    </div>
  );
};
