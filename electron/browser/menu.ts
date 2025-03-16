import { Menu, type MenuItem, type MenuItemConstructorOptions } from "electron";
import Browser from "./main";

export const setupMenu = (browser: Browser) => {
  const isMac = process.platform === "darwin";

  const tab = () => browser.getFocusedWindow().getFocusedTab();
  const tabWc = () => tab().webContents;

  const template: Array<MenuItemConstructorOptions | MenuItem> = [
    ...(isMac ? [{ role: "appMenu" as const }] : []),
    { role: "fileMenu" as const },
    { role: "editMenu" as const },
    {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "CmdOrCtrl+R",
          click: () => tabWc().reload()
        },
        {
          label: "Force Reload",
          accelerator: "Shift+CmdOrCtrl+R",
          click: () => tabWc().reloadIgnoringCache()
        },
        {
          label: "Toggle Developer Tool asdf",
          accelerator: isMac ? "Alt+Command+I" : "Ctrl+Shift+I",
          click: () => tabWc().toggleDevTools()
        },
        { type: "separator" },
        { role: "resetZoom" as const },
        { role: "zoomIn" as const },
        { role: "zoomOut" as const },
        { type: "separator" },
        { role: "togglefullscreen" as const }
      ]
    },
    { role: "windowMenu" as const }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
