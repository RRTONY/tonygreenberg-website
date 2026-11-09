// The GemSpark's four images, rescued from Manus (files.manuscdn.com and the app's
// /manus-storage) into Sanity on 2026-11-10, with location/camera data stripped (the
// trail panorama carried GPS) and the 15,928px panorama resized to 6,000px. Alt text is
// the GemSpark app's own.
export type GemSparkImage = { src: string; width: number; height: number; alt: string };

export const gemsparkImages = {
  art: {
    src: "https://cdn.sanity.io/images/a3q1cyqs/production/524b25e405c3899072f9f38422aede1ff5a56589-2752x1536.png",
    width: 2752,
    height: 1536,
    alt: "The GemSpark Art Piece by David Fenton, dye-sublimation on etched aluminum",
  },
  trail: {
    src: "https://cdn.sanity.io/images/a3q1cyqs/production/62b6f9b3541ed0054124e3ba361f7a305986b6e3-6000x1422.jpg",
    width: 6000,
    height: 1422,
    alt: "Los Leones Trail View",
  },
  pickles: {
    src: "https://cdn.sanity.io/images/a3q1cyqs/production/26b4d625d03eeb9bf52d16aa70d1b9ca3338922e-1441x1921.jpg",
    width: 1441,
    height: 1921,
    alt: "Completely Pickled Pineapple Dill Pickles",
  },
  footDetail: {
    src: "https://cdn.sanity.io/images/a3q1cyqs/production/3ff4262c5f6461d06603dcd8360d69a69ff361d9-1221x2025.jpg",
    width: 1221,
    height: 2025,
    alt: "Detail of the foot in the artwork",
  },
} satisfies Record<string, GemSparkImage>;
