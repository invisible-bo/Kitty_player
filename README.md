![Image](https://github.com/user-attachments/assets/f02b1644-0a63-4752-a86f-edd650bad688)
## Kitty Player
---


#### Introduction

- Simple Mp3 player application with Hello Kitty theme

---
#### Main features
- Add Mp3 files
- Play/Pause
- Previous/Next track 
- Playing track search
- Volume control
- Playlist popup
- Playlist random shuffle

---
#### Tech stacks  

**Design Tool**
![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white)


**GUI Framework**
![Electron](https://img.shields.io/badge/electron-%2347848F.svg?style=for-the-badge&logo=electron&logoColor=white)


**Frontend**
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)&nbsp;![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)&nbsp;![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

---
#### How to install  
1. clone this repository  


```
git clone https://github.com/invisible-bo/Kitty_player.git
```  
<br>  

2. install Node.js
 
<small>Windows</small><br>  
[Node.js official web](https://nodejs.org/ko)  

  
<small>Mac</small>
```
brew install node
```
<br>  

3. install npm (dependencies & devDependencies in `package.json` )
```
npm install
```
<br>  

4. run application
```
npm start
```  
- if not working on Mac try this command and `npm start` again
```
npm cache clean --force
```


<br>

5. export setup file 
```
npm run dist
```

Windows<br>
```
# run KittyPlayer Setup 1.0.0.exe` in dist folder  
```

Mac
```
# run dist/KittyPlayer-1.0.0.dmg in Finder
# drag KittyPlayer.app to Applications folder 
```