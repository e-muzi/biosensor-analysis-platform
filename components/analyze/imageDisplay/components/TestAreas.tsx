import { Box } from "@mui/material";
import { PESTICIDE_ROIS } from "../../../../utils/constants/roiConstants";

export const TestAreas = () => {
  return (
    <>
      {PESTICIDE_ROIS.map(({name, roi}) => (
        <Box
          key={name}
          sx={{
            position: "absolute",
            left: `${roi.x * 100}%`,
            top: `${roi.y * 100}%`,
            width: `${roi.width * 100}%`,
            height: `${roi.height * 100}%`,
            border: "2px solid",
            borderColor: "primary.main",
            backgroundColor: "rgba(25, 118, 210, 0.1)",
            pointerEvents: "none",
            borderRadius: 1,
          }}
        />
      ))}
    </>
  );
};
