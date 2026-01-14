import { mainMenu } from "./command_tui";
import { User } from "./lib/db/schema";
import  blessed, { form }  from "blessed";
import { resetScreen } from "./resetScreenTUI";
import { createUser, getUser } from "./lib/db/queries/users";
import { setUser } from "./config";

export async function regTUI(user: User, screen: blessed.Widgets.Screen) {
    resetScreen(screen);
    screen.key(['escape', 'q', 'C-c'], () => {
        resetScreen(screen);
        mainMenu(user, screen);
        //screen.render();
    });

    screen.title = `Register new user`;
    
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

        const nameLabel = blessed.text({
                parent: screen,
                top: 3,
                left: 5,
                content: 'Name:',
            });

        const nameInput = blessed.textbox({
                parent: inputForm,
                name: 'name',
                top: 4,
                left: 4,
                //width: '60%-2',
                height: 3,
                inputOnFocus: true,
                border: 'line',
                value: '',
            });

        const submit = blessed.button({
                parent: inputForm,
                name: 'submit',
                content: 'Submit',
                top: 9,
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
                top: 9,
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

            inputForm.on('submit', async (data: any) => {
                    const name = data.name;
            
                    if(name.trim().length === 0){
                        message.display('Missing or invalid value!', () => {});
                    } else {
                        const userCheck = await getUser(name);
                        if(userCheck){
                            message.display(`${name} already in database!`, () => {
                            resetScreen(screen);
                            mainMenu(user, screen);
                            });
                        } else {
                            const newUser = await createUser(name);
                            message.display(`${newUser.name} added to database`, () => {
                            setUser(newUser.name);
                            resetScreen(screen);
                            mainMenu(newUser, screen);
                        })
                        }
                    }
                });
                
            
                const message = blessed.message({
                    parent: screen,
                    hidden: true,
                });
                
                nameInput.focus();
                screen.render();
        
}
