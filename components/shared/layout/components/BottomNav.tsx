import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { 
  Analytics as AnalyticsIcon,
  History as HistoryIcon,
  Settings as SettingsIcon 
} from "@mui/icons-material";
import { iGEMColors } from "../../../../state/themeStore";

interface BottomNavProps {
  currentTab: "analyze" | "history" | "settings";
  onTabChange: (tab: "analyze" | "history" | "settings") => void;
}

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const getTabIndex = (tab: "analyze" | "history" | "settings") => {
    switch (tab) {
      case "analyze": return 0;
      case "history": return 1;
      case "settings": return 2;
      default: return 0;
    }
  };

  const getTabFromIndex = (index: number): "analyze" | "history" | "settings" => {
    switch (index) {
      case 0: return "analyze";
      case 1: return "history";
      case 2: return "settings";
      default: return "analyze";
    }
  };

  const handleBottomNavChange = (newValue: number) => {
    onTabChange(getTabFromIndex(newValue));
  };

  return (
    <Paper sx={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0,
      zIndex: 1000, // Ensure it's above other content
      paddingBottom: "env(safe-area-inset-bottom, 0px)", // Add safe area padding
      height: "calc(56px + env(safe-area-inset-bottom, 0px))" // Explicit height calculation
    }} elevation={3}>
      <BottomNavigation
        value={getTabIndex(currentTab)}
        onChange={(_, newValue) => handleBottomNavChange(newValue)}
        sx={{
          '& .Mui-selected': {
            color: iGEMColors.primary,
          },
        }}
      >
        <BottomNavigationAction
          label="Analyze"
          icon={<AnalyticsIcon />}
        />
        <BottomNavigationAction
          label="History"
          icon={<HistoryIcon />}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<SettingsIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
}
