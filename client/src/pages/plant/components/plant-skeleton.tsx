import React from "react";
import { Box, Grid, Skeleton, Typography, Paper } from "@mui/material";
import "./../plant.css";

export const PlantSkeleton: React.FC = () => {
  return (
    <div className="pagePlant">
      {/* Page Title */}
      <Skeleton 
        variant="text" 
        width={300} 
        height={60} 
        sx={{ mb: 4, mx: "auto", bgcolor: "rgba(255,255,255,0.1)" }} 
      />

      <Grid container spacing={4} sx={{ width: '100%', maxWidth: '1200px' }}>
        
        {/* 1. Status Card Skeleton */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper className="cardPlanta" sx={{ p: 3, height: '100%', borderRadius: '15px' }}>
                {/* Title */}
                <Skeleton variant="text" width={150} height={30} sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.1)" }} />
                
                {/* Icons & Values Row */}
                <Box display="flex" justifyContent="space-around" mb={3}>
                     <Box display="flex" flexDirection="column" alignItems="center">
                         <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.1)" }} />
                         <Skeleton variant="text" width={80} height={40} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                         <Skeleton variant="text" width={40} height={20} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                     </Box>
                     <Box display="flex" flexDirection="column" alignItems="center">
                         <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.1)" }} />
                         <Skeleton variant="text" width={80} height={40} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                         <Skeleton variant="text" width={60} height={20} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                     </Box>
                </Box>

                {/* Pump Status Box */}
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: '16px', mb: 3, bgcolor: "rgba(255,255,255,0.05)" }} />

                {/* Chart Area */}
                 <Skeleton variant="rectangular" height={180} sx={{ borderRadius: '12px', bgcolor: "rgba(255,255,255,0.05)" }} />
            </Paper>
        </Grid>

        {/* 2. Config Card Skeleton (Now in correct position) */}
        <Grid size={{ xs: 12, md: 6 }}>
            <Paper className="cardPlanta" sx={{ p: 3, height: '100%', borderRadius: '15px' }}>
                 {/* Title */}
                <Skeleton variant="text" width={220} height={30} sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.1)" }} />

                {/* Days Row */}
                <Box display="flex" justifyContent="center" gap={1} mb={4} mt={2}>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <Skeleton key={i} variant="circular" width={36} height={36} sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
                    ))}
                </Box>

                {/* Content Row: Clock + Buttons */}
                <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3} alignItems="center">
                     {/* Clock Skeleton */}
                    <Box flex={1} display="flex" justifyContent="center">
                        <Skeleton variant="circular" width={180} height={180} sx={{ bgcolor: "rgba(255,255,255,0.05)" }} />
                    </Box>
                    
                    {/* Buttons Skeleton */}
                    <Box flex={1} display="flex" flexDirection="column" gap={2} width="100%">
                         <Skeleton variant="rectangular" height={40} sx={{ borderRadius: '12px', bgcolor: "rgba(255,255,255,0.05)" }} />
                         <Skeleton variant="rectangular" height={50} sx={{ borderRadius: '12px', bgcolor: "rgba(255,255,255,0.1)" }} />
                    </Box>
                </Box>
            </Paper>
        </Grid>

        {/* 3. Schedule Card Skeleton (Full width at bottom) */}
        <Grid size={{ xs: 12 }}>
             <Paper className="cardPlanta" sx={{ p: 3, minHeight: '300px', borderRadius: '15px' }}>
                {/* Title */}
                 <Skeleton variant="text" width={200} height={30} sx={{ mb: 1, bgcolor: "rgba(255,255,255,0.1)" }} />
                 <Skeleton variant="text" width={120} height={20} sx={{ mb: 3, bgcolor: "rgba(255,255,255,0.05)" }} />

                 {/* Tasks List */}
                 <Box display="flex" flexDirection="column" gap={2}>
                     {[1, 2, 3].map((i) => (
                        <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: '15px', bgcolor: "rgba(255,255,255,0.05)" }} />
                     ))}
                 </Box>
             </Paper>
        </Grid>

      </Grid>
    </div>
  );
};
