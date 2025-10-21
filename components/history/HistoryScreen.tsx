import { useState, useMemo } from 'react';
import { Container, Typography, Box, TextField, InputAdornment } from '@mui/material';
import { History as HistoryIcon, Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { HistoryItem } from './HistoryItem';
import { useHistoryStore } from '../../state/historyStore';
import { EmptyState } from '../shared/EmptyState';

export function HistoryScreen() {
  const { records, deleteRecord, updateRecordName } = useHistoryStore();
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateName = (id: string, name: string) => {
    updateRecordName(id, name);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Filter records based on search term
  const filteredRecords = useMemo(() => {
    if (!searchTerm.trim()) {
      return records;
    }
    
    return records.filter(record =>
      record.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  // Show empty state when no records exist
  if (records.length === 0) {
    return (
      <Container maxWidth='md' sx={{ py: 3, pb: 12 }}>
        <Typography variant='h4' sx={{ mb: 3 }}>
          Analysis History
        </Typography>
        <EmptyState
          title='No analysis history'
          description='Your completed analyses will appear here'
          icon={<HistoryIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
        />
      </Container>
    );
  }

  // Show no search results state
  if (searchTerm.trim() && filteredRecords.length === 0) {
    return (
      <Container maxWidth='md' sx={{ py: 3, pb: 8 }}>
        <Typography variant='h4' sx={{ mb: 3 }}>
          Analysis History
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search history by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <ClearIcon 
                  onClick={handleClearSearch}
                  sx={{ cursor: 'pointer' }}
                />
              </InputAdornment>
            ),
          }}
        />

        <EmptyState
          title='No matching results'
          description={`No history items found matching "${searchTerm}"`}
          icon={<SearchIcon sx={{ fontSize: 64, color: 'text.secondary' }} />}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ py: 3, pb: 8 }}>
      <Typography variant='h4' sx={{ mb: 3 }}>
        Analysis History
      </Typography>

      <TextField
        fullWidth
        placeholder="Search history by name..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <ClearIcon 
                onClick={handleClearSearch}
                sx={{ cursor: 'pointer' }}
              />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 2 }}>
        {filteredRecords.map(record => (
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
