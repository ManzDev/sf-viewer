const SOUNDS = {
  beep: new Audio("sounds/beep.ogg"),
  select: new Audio("sounds/select.ogg")
};

export const playSound = (sound = "beep") => {
  SOUNDS[sound].volume = 1;
  SOUNDS[sound].currentTime = 0;
  SOUNDS[sound].play();
};
