import { mainMenu, tui } from "./command_tui";
import { getPostsForUser } from "./lib/db/queries/feeds";
import { User } from "./lib/db/schema";
import  blessed  from "blessed";
import { openPost } from "./postSingleTUI";
import { resetScreen } from "./resetScreenTUI";

export async function postsTUI( user: User, screen:blessed.Widgets.Screen ) {

    // clear screen and reset listeners (q to quit)
    resetScreen(screen);
    
    screen.key(['escape', 'q', 'C-c'], () => {
        resetScreen(screen);
        mainMenu(user, screen);
    });

    // get posts
    const posts = await getPostsForUser(user, 100);
    //push posts into array of arrays for listtable
    let postOut : string[][]= [];
    postOut.push(['Title', 'Published']);

    for (let post of posts){
        
        postOut.push([`${post.title}`, ` - ${post.pubDate}`]);
        //postOut.push([`${post.description}`]);
    }
    
    let table = blessed.listtable({
        parent: screen,
        top: 0,//'center',
        left: 0,//'center',
        width: '100%',
        height: '100%-1',
        tags: true,
        border: 'line',
        align: 'left',
        keys: true,
        vi: true,
        style: {
            header: { bold: true },
            cell: { selected: { bg: "blue" } },
        }
    });

    table.setData(postOut);
    
    table.on('select', (item, index) => {
        const postIndex = index - 1;
        if (postIndex >= 0 && postIndex < postOut.length){
            const post = postOut[postIndex][0];
            resetScreen(screen);
            openPost(user, post,screen);
        }
    });
    const helpText = blessed.box({
        parent: screen,
        bottom: 0,
        left: 0,
        height: 1,
        width: '100%',
        tags: true,
        style: {
            fg: 'gray',
        },
        content: 'q: back | ↑/↓: move',
    });

    table.focus();
    screen.render();

    



}