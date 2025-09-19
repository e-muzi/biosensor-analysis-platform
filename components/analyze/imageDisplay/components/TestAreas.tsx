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
            border: "1px solid",
            borderColor: "primary.main",
            backgroundColor: "transparent",
            pointerEvents: "none",
            borderRadius: 1,
            zIndex: 1,
          }}
        />
      ))}
    </>
  );
};
