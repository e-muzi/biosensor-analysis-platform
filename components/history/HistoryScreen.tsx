import { Container, Typography, Box } from "@mui/material";
import { History as HistoryIcon } from "@mui/icons-material";
import { HistoryItem } from "./HistoryItem";
import { useHistoryStore } from "../../state/historyStore";
import { EmptyState } from "../shared/EmptyState";

export function HistoryScreen() {
  const { records, deleteRecord, updateRecordName } = useHistoryStore();

  const handleUpdateName = (id: string, name: string) => {
    updateRecordName(id, name);
  };

  if (records.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 3, pb: 12 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Analysis History
        </Typography>
        <EmptyState
          title="No analysis history"
          description="Your completed analyses will appear here"
          icon={<HistoryIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3, pb: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Analysis History
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pb: 2 }}>
        {records.map((record) => (
          <HistoryItem 
            key={record.id} 
            record={record} 
            onDelete={deleteRecord}
            onUpdateName={handleUpdateName}
          />
        ))}
      </Box>
    </Container>
  );
}
