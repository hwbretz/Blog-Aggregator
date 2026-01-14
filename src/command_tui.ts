import { postsTUI } from "./postsTUI";
import { User } from "./lib/db/schema";
import  blessed  from "blessed";
import { addFeedTUI } from "./addFeedTUI";
import { resetScreen } from "./resetScreenTUI";
import { regTUI } from "./registerTUI";
import { loginTUI } from "./loginTUI";


export async function tui(cmdName: string, user: User, ...args: string[]){
    let screen = blessed.screen({
        smartCSR: true
    });

    mainMenu(user, screen);
}

export async function mainMenu(user: User, screen: blessed.Widgets.Screen){
    
    resetScreen(screen);
    
    screen.key(['escape', 'q', 'C-c'], () => {
        screen.destroy();
        process.exit(0);
    });

    screen.title = `Welcome ${user.name}`

    let menu = blessed.listbar({
        parent: screen,
        top: 'center',
        left: 'center',
        width: '55%',
        height: '20%',
        tags: true,
        border: 'line',
        align: 'left',
        keys: true,
        vi: true,
        style: {
            bold: true,
            selected: {bg: 'blue'}
        },
        commands: [],
        items: [],
        autoCommandKeys: false
    });

    (menu as any).add('View Posts',(() => {
        resetScreen(screen);
        postsTUI(user, screen);
    }));

    (menu as any).add('Add Feed', (() => {
        resetScreen(screen);
        addFeedTUI(user,screen)
    }));

    (menu as any).add('Register new user', (() => {
        resetScreen(screen);
        regTUI(user, screen);
    }));

    (menu as any).add('Login', (() => {
        resetScreen(screen);
        loginTUI(user, screen);
    }));

    //screen.append(menu);
    menu.focus();
    screen.render();


}