document.addEventListener("DOMContentLoaded", function() {
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");
    const searchBox = document.getElementById("searchBox");
    const projectList = document.getElementById("projectList");
    const projects = projectList.getElementsByTagName("li");
    const splitters = document.querySelectorAll(".splitter");
    const projectContent = document.getElementById("projectContent");
    const mediaitem = document.getElementById("projectContent")
    const toggleSidebar = document.getElementById("toggleSidebar");
    const round = document.getElementById("round");
  
    const stats = document.querySelector(".stats");

    toggleSidebar.addEventListener("click", function() {
     
  
        sidebar.classList.toggle("collapsed");
      
        searchBox.style.display = sidebar.classList.contains("collapsed") ? "none" : "block";

        if (sidebar.classList.contains("collapsed")) {
            stats.classList.add("hidden");
        } else {
            stats.classList.remove("hidden");
        }
       
    });
   

    searchBox.addEventListener("keyup", function() {
        const filter = searchBox.value.toLowerCase();
        for (let i = 0; i < projects.length; i++) {
            const txtValue = projects[i].textContent || projects[i].innerText;
            projects[i].style.display = txtValue.toLowerCase().includes(filter) ? "" : "none";
        }
    });

    splitters.forEach(splitter => {
        splitter.addEventListener("mousedown", function(e) {
            e.preventDefault();
            document.addEventListener("mousemove", resizePanel);
            document.addEventListener("mouseup", stopResize);
        });
    });

    function resizePanel(e) {
        const sidebarWidth = e.clientX;
        const statsWidth = window.innerWidth - e.clientX - 200;
        if (sidebarWidth > 50 && statsWidth > 150) {
            sidebar.style.width = sidebarWidth + "px";
            document.querySelector(".stats").style.width = statsWidth + "px";
        }
    }

    function stopResize() {
        document.removeEventListener("mousemove", resizePanel);
        document.removeEventListener("mouseup", stopResize);
    }

    function updatemenu() {
        const menu = document.getElementById('menu');
        menu.style.borderRadius = document.getElementById('responsive-menu').checked ? '0' : '9px';
    }

    projectList.addEventListener("click", function(event) {
        const selectedProject = event.target;
        if (selectedProject.tagName.toLowerCase() === "li") {
            const projectName = selectedProject.textContent.trim();
            loadProjectDescription(projectName);
        }
    });
    mediaitem.addEventListener("click", function(event) {
        let selectedProject = event.target;
        let projectName = "";
    
        
        if (selectedProject.tagName.toLowerCase() === "img") {
            let parent = selectedProject.closest(".media-item");
            if (parent) {
                let titleElement = parent.querySelector("h2");
                if (titleElement) {
                    projectName = titleElement.textContent.trim();
                }
            }
        }
        
        else if (selectedProject.tagName.toLowerCase() === "h2") {
            projectName = selectedProject.textContent.trim();
        }

        if (projectName) {
            loadProjectDescription(projectName);
        }
    });
    
    


    function loadProjectDescription(projectName) {
        const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.md`;

        fetch("docs/"+fileName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Fehler beim Laden der Datei: ${fileName}`);
                }
                return response.text();
            })
            .then(data => {
                if (typeof marked !== "undefined") {
                    projectContent.innerHTML = marked.parse(data);
                } else {
                    projectContent.innerHTML = `<p>Marked.js ist nicht geladen.</p>`;
                }
            })
            .catch(error => {
                projectContent.innerHTML = `<p>Es konnte keine Beschreibung für das Projekt "${projectName}" geladen werden. Fehler: ${error.message}</p>`;
            });
    }
    round.addEventListener("click", function() {
        loadProjectPage("round");
      
    });
    page.addEventListener("click", function() {
        loadProjectPage("cell");
      
    });

    function loadProjectPage(projectName) {
        const fileName = `${projectName.toLowerCase().replace(/\s+/g, '-')}.html`;
    
        fetch("page/"+fileName)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Fehler beim Laden der Datei: ${fileName}`);
        }
        return response.text();
    })
    .then(html => {
        projectContent.innerHTML = html;
    })
    .catch(error => {
        projectContent.innerHTML = `<p>Es konnte keine Seite für das Projekt "${projectName}" geladen werden. Fehler: ${error.message}</p>`;
    });

  
    }
   
    
    const canvas = document.getElementById("particleCanvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const numParticles = 300;
    const maxDistance = 120;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 4 + 1;
            this.currentRadius = 0; 
            this.growthSpeed = 0.01; 
            this.xSpeed = Math.random() * 1 - 0.1;
            this.ySpeed = Math.random() * 1 - 0.1;
        }
    
        move() {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
    
            if (this.x < 0 || this.x > canvas.width) this.xSpeed *= -1;
            if (this.y < 0 || this.y > canvas.height) this.ySpeed *= -1;
    
            if (this.currentRadius < this.radius) {
                this.currentRadius += this.growthSpeed;
            }
        }
    
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(25, 30, 46, 0.24)";
            ctx.fill();
        }
    }
    
    function addParticle() {
        if (particles.length < numParticles) {
            particles.push(new Particle());
            setTimeout(addParticle, 5000); 
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
    
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(100, 100, 100, ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        particles.forEach(particle => {
            particle.move();
            particle.draw();
        });
    
        drawConnections();
        requestAnimationFrame(animate);
    }
    
    addParticle();
    animate();
    

});
