const player = document.getElementById("player");
const game = document.getElementById("game");
const music = document.getElementById("music");

let mode = "cube";
let velocity = 0;
let gravity = 0.6;
let jumpStrength = 12;
let levelLength = 8000;

// Arrays to store obstacles and portals
let spikes = [];
let portals = [];

// Generate obstacles
for(let i=600;i<levelLength;i+=200){
    let spike = document.createElement("div");
    spike.classList.add("spike");
    spike.style.left = i + "px";
    game.appendChild(spike);
    spikes.push(spike);
}

// Generate portals for mode switching
const portalModes = ["cube","ship","wave","ball"];
for(let i=1500;i<levelLength;i+=1500){
    let p = document.createElement("div");
    let m = portalModes[Math.floor(Math.random()*portalModes.length)];
    p.classList.add("portal",m);
    p.style.left = i+"px";
    game.appendChild(p);
    portals.push(p);
}

// Generate extra decorations dynamically
for(let i=500;i<levelLength;i+=400){
    let deco = document.createElement("div");
    deco.classList.add("deco",Math.random()>0.5?"circle":"star");
    deco.style.left = i+"px";
    deco.style.bottom = Math.random()*150+"px";
    game.appendChild(deco);
}

// Keyboard controls
document.addEventListener("keydown", e => {
    if(e.code==="Space"){
        if(mode==="cube" || mode==="mini"){
            velocity = jumpStrength;
        } else if(mode==="ship"){
            velocity = 6;
        } else if(mode==="wave"){
            velocity = -velocity || -6;
        } else if(mode==="ball"){
            velocity = -velocity || 8;
        }
    }
});

// Game loop
function gameLoop(){
    // Physics
    if(mode==="cube" || mode==="mini" || mode==="ball"){
        velocity -= gravity;
    }

    let bottom = parseFloat(getComputedStyle(player).bottom);
    bottom += velocity;
    if(bottom<0){ bottom=0; velocity=0; }
    if(bottom>260) bottom=260;
    player.style.bottom = bottom+"px";

    // Move obstacles
    spikes.forEach(s=>{
        let left = parseFloat(s.style.left);
        left -=6;
        s.style.left = left+"px";
        let rect1 = player.getBoundingClientRect();
        let rect2 = s.getBoundingClientRect();
        if(rect1.right>rect2.left && rect1.left<rect2.right && rect1.bottom>rect2.top){
            alert("Game Over!");
            location.reload();
        }
    });

    // Move portals
    portals.forEach(p=>{
        let left = parseFloat(p.style.left);
        left -=6;
        p.style.left = left+"px";
        let rect1 = player.getBoundingClientRect();
        let rect2 = p.getBoundingClientRect();
        if(rect1.right>rect2.left && rect1.left<rect2.right){
            if(p.classList.contains("cube")) mode="cube";
            if(p.classList.contains("ship")) mode="ship";
            if(p.classList.contains("wave")) mode="wave";
            if(p.classList.contains("ball")) mode="ball";
        }
    });

    // Move decorations (parallax)
    document.querySelectorAll(".deco").forEach(d=>{
        let left = parseFloat(d.style.left);
        left -= 2;
        if(left<-50) left = window.innerWidth;
        d.style.left = left+"px";
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
