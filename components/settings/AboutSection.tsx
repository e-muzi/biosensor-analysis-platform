import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Avatar,
  Link,
  Chip,
  Button
} from '@mui/material';
import { useThemeStore, iGEMColors } from '../../state/themeStore';
import { getVersionInfo } from '../../utils/version';

export const AboutSection: React.FC = () => {
  const { getColors } = useThemeStore();
  const colors = getColors();
  const versionInfo = getVersionInfo();

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        About
      </Typography>
      
      <Card sx={{ textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Team Information */}
          <Box sx={{ mb: 4 }}>
            <Avatar
              src="/hkjs_logo.png"
              alt="HK-JOINT-SCHOOL"
              sx={{
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
                border: 3,
                borderColor: iGEMColors.primary
              }}
            />
            
            <Typography variant="h6" component="h3" gutterBottom>
              HK-JOINT-SCHOOL
            </Typography>
            <Chip
              label="iGEM 2025"
              sx={{
                backgroundColor: iGEMColors.primary,
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>

          {/* App Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h4" gutterBottom>
              Pesticide Biosensor Analysis App
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Version: <Typography component="span" sx={{ fontFamily: 'monospace' }}>v{versionInfo.version}</Typography>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Build Date: 01/07/2025
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last Updated: {versionInfo.buildDate}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Platform: {versionInfo.platform}
              </Typography>
            </Box>
          </Box>

          {/* Links */}
          <Box sx={{ pt: 2 }}>
            <Button
              component={Link}
              href="https://github.com/e-muzi/biosensor-apptesting-2"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                backgroundColor: iGEMColors.primary,
                mb: 2,
                '&:hover': {
                  backgroundColor: iGEMColors.primaryDark,
                }
              }}
            >
              📁 Project GitHub link
            </Button>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Developed for iGEM 2025 Competition
              </Typography>
              <Typography variant="body2" color="text.secondary">
                For bugs, contact{' '}
                <Link 
                  href="mailto:s2021060@cpu.edu.hk" 
                  color="primary"
                  sx={{ textDecoration: 'underline' }}
                >
                  s2021060@cpu.edu.hk
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
