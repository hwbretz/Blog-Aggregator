
import { mainMenu } from "./command_tui";
import { User } from "./lib/db/schema";
import  blessed, { form }  from "blessed";
import { createFeed } from "./lib/db/queries/feeds";
import { resetScreen } from "./resetScreenTUI";

export async function addFeedTUI(user: User, screen: blessed.Widgets.Screen){
   
    resetScreen(screen);
    screen.key(['escape', 'q', 'C-c'], () => {
        resetScreen(screen);
        mainMenu(user, screen);
        //screen.render();
    });

    screen.title = `Add Feed for ${user.name}`;

    const inputForm = blessed.form({
        parent: screen,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        keys: true,
        vi: true,
        border: 'line',
        
    });

    
    const feedLabel = blessed.text({
        parent: screen,
        top: 3,
        left: 5,
        content: 'Feed Name:',
    });
    const urlLabel = blessed.text({
        parent: screen,
        top: 8,
        left: 5,
        content: 'URL:',
    });
    
    
    const feedInput = blessed.textbox({
        parent: inputForm,
        name: 'feedName',
        top: 4,
        left: 4,
        //width: '60%-2',
        height: 3,
        inputOnFocus: true,
        border: 'line',
        value: '',
    });


    const urlInput = blessed.textbox({
        parent: inputForm,
        name: 'url',
        top: 9,
        left: 4,
        //width: '60%-2',
        height: 3,
        inputOnFocus: true,
        value: '',
        border: 'line',
    });
    
    const submit = blessed.button({
        parent: inputForm,
        name: 'submit',
        content: 'Submit',
        top: 14,
        left: 0,
        shrink: true,
        keys: true,
        mouse: true,
        focusable: true,
        padding: {
            top: 1,
            right: 2,
            bottom: 1,
            left: 2
        },
        style: {
            bold: true,
            focus: { inverse: true},
        },
    });

    const cancel = blessed.button({
        parent: inputForm,
        name: 'cancel',
        content: 'Cancel',
        top: 14,
        left: 11,
        shrink: true,
        keys: true,
        mouse: true,
        focusable: true,
        padding: {
            top: 1,
            right: 2,
            bottom: 1,
            left: 2
        },
        style: {
            bold: true,
            focus: { inverse: true},
        },
    });

    submit.on('press', () => {
        inputForm.submit();
    });

    cancel.on('press', () => {
        resetScreen(screen);
        mainMenu(user, screen);
    });

    inputForm.on('submit', (data: any) => {
        const name = data.feedName;
        const url  = data.url || '';

        if(name.trim().length === 0 || url.trim().length <= 8){
            message.display('Missing  or invalid Input Values!', () => {});
        } else {
            createFeed(data.feedName, data.url, user.name);
            message.display("Feed added to database", () => {
                resetScreen(screen);
                mainMenu(user, screen);
            })
        }
    });
    

    const message = blessed.message({
        parent: screen,
        hidden: true,
    });
    
    feedInput.focus();
    screen.render();
}