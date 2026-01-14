import { eq } from "drizzle-orm";
import { db } from "./lib/db";
import { posts, User } from "./lib/db/schema";
import blessed  from "blessed";
import { postsTUI } from "./postsTUI";
import { resetScreen } from "./resetScreenTUI";

export async function openPost(user: User, postTitle: string, screen: blessed.Widgets.Screen) {
    const [post] = await db.select().from(posts).where(eq(posts.title,postTitle));

    if(!post){
        resetScreen(screen);
        
        const errorBox = blessed.box({
            parent: screen,
            top: 'center',
            left: 'center',
            width: '60%',
            height: '20%',
            content: `Error fetching post: ${postTitle}`,
            align: 'left',
            border:'line',
        });
        
        screen.key(['escape', 'q', 'C-c'], () => {
            resetScreen(screen);
            postsTUI(user,screen);
        });
        errorBox.focus();
        screen.render();
        return;
    }else {
        resetScreen(screen);
        screen.title = `${user.name}`;
        screen.key(['escape', 'q', 'C-c'], () => {
            resetScreen(screen);
            postsTUI(user,screen);
        });
        
        const textBox = blessed.box({
            parent: screen,
            top: 'center',
            left: 'center',
            width: '65%',
            height: '80%',
            content: `Title: ${post.title} 
            \nPublished: ${post.published_at}
            \n${post.description}`,
            tags: true,
            align: 'left',
            border:'line',
            scrollable: true,
            keys: true,
            vi: true,
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
            content: 'q: back',
        });

        textBox.focus();
        screen.render();
    }

    

}