import { Box, Typography, IconButton, Chip } from "@mui/material";
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from "@mui/icons-material";
import type { AnalysisResult } from "../../../types";

interface HistoryHeaderProps {
  name: string;
  timestamp: string;
  results: AnalysisResult[];
  isExpanded: boolean;
  onDelete: (id: string) => void;
  onToggleExpanded: () => void;
  recordId: string; // Add this prop
}

export function HistoryHeader({
  name,
  timestamp,
  results,
  isExpanded,
  onDelete,
  onToggleExpanded,
  recordId, // Add this parameter
}: HistoryHeaderProps) {
  const getTotalConcentration = (results: AnalysisResult[]) => {
    return results.reduce((sum, result) => sum + result.concentration, 0);
  };

  const getMaxConcentration = (results: AnalysisResult[]) => {
    return Math.max(...results.map(result => result.concentration));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(timestamp)}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
          <Chip 
            label={`${results.length} result${results.length !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
          {results.length > 0 && (
            <Chip 
              label={`Max: ${getMaxConcentration(results).toFixed(3)} ppm`}
              size="small"
              color="primary"
            />
          )}
        </Box>
      </Box>
      
      <IconButton onClick={onToggleExpanded}>
        {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
      
      <IconButton onClick={() => onDelete(recordId)} color="error">
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
