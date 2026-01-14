import  blessed  from "blessed";

export function resetScreen(screen: blessed.Widgets.Screen){
    // destroy *all* widgets
  screen.children.forEach(child => child.destroy());

  // remove global listeners you manage manually
  screen.removeAllListeners();
  screen.removeAllListeners('resize');

  // optional visual clear
  screen.clearRegion(0, screen.width, 0, screen.height);
  screen.render();
};