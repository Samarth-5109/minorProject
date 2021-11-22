const express = require("express");
//const fs = require('fs');
const ytdl = require('ytdl-core');
const app = express();
var cors = require('cors')

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.use(cors())

// app.get("/",(req,res)=>{
//     ytdl('https://youtu.be/W1CzJ4bvD4M')
//   .pipe(fs.createWriteStream('video.mp4'));
//     res.send("hello")
// })

// functions

const convertUrl = (url)=>{

    let newUrlArray;
    if(url.includes("youtu.be")){
         newUrlArray = url.split("https://youtu.be/")
         return `https://youtube.com/watch?v=${newUrlArray[1]}`
    }else
    if(url.includes("https://youtube.com/shorts/")){

        newUrlArray = url.split("https://youtube.com/shorts/")
        return `https://youtube.com/watch?v=${newUrlArray[1]}`
   }
   else if(url.includes("https://youtube.com/watch?v")){
       return url
   }
   else{
       return "https://youtube.com/watch?v=dQw4w9WgXcQ"
   }
}

//video
app.get("/video",async(req,res)=>{
    console.log(req.query.videoId)
    const videoId = convertUrl(req.query.videoId)
     let info = await ytdl.getInfo(videoId)
     res.json(info)
})
//audio
app.get("/audio",async(req,res)=>{
    const videoId = convertUrl(req.query.videoId)
    let info = await ytdl.getInfo(videoId)
    let audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    res.json(audioFormats)
})



//download video download
app.get("/download",async(req,res)=>{
    const {itag,title,type} = req.query
    const videoId = convertUrl(req.query.videoId)
    if(type === "mp4"){
		res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
		res.header('Content-Type', 'video/mp4');
	}else if(type === "mp3"){
		res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
		res.header('Content-Type', 'audio/mp3');
	}

	ytdl(videoId, { filter: format => format.itag === parseInt(itag) }).pipe(res); 
	

    
})
//app.listen(4000,console.log("working..."))
app.listen(port,console.log("working..."))