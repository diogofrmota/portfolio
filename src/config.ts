export const siteConfig = {
  name: "Diogo Mota",
  title: "Senior DevOps Engineer",
  description: "Portfolio website of Diogo Mota - DevOps Engineer",
  accentColor: "#1d4ed8",
  location: "Lisbon, PT",
  social: {
    email: "diogofrmota@gmail.com",
    linkedin: "https://linkedin.com/in/diogofrmota",
    github: "https://github.com/diogofrmota",
  },
  aboutMe:
    "I am a dedicated DevOps Engineer with over 3 years of experience in solution architecture and infrastructure deployment. In my current role at Akkodis, I am responsible for managing and architecting cloud and on-premise environments using tools like AWS, Kubernetes, Docker, Python, Java, Terraform, Ansible, Grafana, Prometheus, PostgreSQL and Helm Charts. Beyond my professional work, I actively maintain a hand-built homelab on a 3-node cluster using multiple Raspberry Pis where I recreate a real production environment. This personal project allows me to enhance my skills in automation, network, virtualization and monitoring with tools like ArgoCD, Kubernetes, Helm Charts, NGINX Ingress Controller, MetalLB, Prometheus, Grafana and Cert-Manager.",
  skills: ["DevOps", "Solutions Architect", "AWS", "Terraform", "Kubernetes", "Docker"],
  experience: [
    {
      company: "Tech Company",
      title: "Senior Software Engineer",
      dateRange: "Jan 2022 - Present",
      bullets: [
        "Led development of microservices architecture serving 1M+ users",
        "Reduced API response times by 40% through optimization",
        "Mentored team of 5 junior developers",
      ],
    },
    {
      company: "Startup Inc",
      title: "Full Stack Developer",
      dateRange: "Jun 2020 - Dec 2021",
      bullets: [
        "Built and launched MVP product from scratch using React and Node.js",
        "Implemented CI/CD pipeline reducing deployment time by 60%",
        "Collaborated with product team to define technical requirements",
      ],
    },
    {
      company: "Akkodis",
      title: "DevOps Engineer",
      dateRange: "January 2025 - Present",
      bullets: [
        "Deployment and management of applications on Kubernetes and Red Hat OpenShift clusters",
        "Design and implementation of a GitOps-based CI/CD pipeline with ArgoCD and GitHub Actions",
        "Creation of custom Helm charts for standardized application deployment across all environments",
        "Automation of image creation, vulnerability scanning and system patching using Python and Bash scripts",
        "Provisioning of high-availability PostgreSQL and MongoDB databases with encryption using Docker Compose",
        "Configuration of log aggregation pipelines using FluentBit, Kafka and OpenSearch",
      ],
    },
    {
      company: "KPMG Portugal",
      title: "Technology Consultant",
      dateRange: "October 2022 - January 2025",
      bullets: [
        "Execution of an end-to-end migration of a core banking system from on-premise to a hybrid cloud environment on AWS",
        "Development of cloud transformation roadmaps and migration strategies for client transitions to Azure and AWS platforms",
        "Definition of CI/CD pipelines strategies to automate the software delivery process",
        "Performance of architecture, assessment, design and implementation reviews for client systems",
      ],
    },
    {
      company: "Tetra Pak",
      title: "Quality - Master Thesis Internship",
      dateRange: "March 2022 - August 2022",
      bullets: [
        "Development and implementation of a project for the master's thesis",
        "Analyzed and optimized maintenance strategies to enhance system reliability and efficiency",
      ],
    },
  ],
  projects: [
    {
      name: "Self-Hosted Infrastructure (Homelab)",
      description:
        "Configured a Raspberry Pi 3B+ as bare-metal, headless Debian server with a dashboard for monitoring updates, networking, and storage. Automated smart home IoT lights and switches based on sunrise, sunset, and custom rules using lightweight scheduling.",
      link: null,
      skills: ["Docker", "Kubernetes", "Linux", "Monitoring", "Networking"],
    },
    {
      name: "Chrome Extension Mastery: Build Full-Stack Extensions with React & Node.js",
      description:
        "Master the art of building production-ready, full-stack Chrome Extensions using modern web technologies and best practices",
      link: "https://fullstackextensions.com/?ref=devportfolio",
      skills: ["React", "Node.js", "AWS"],
    },
    {
      name: "ExtensionKit",
      description:
        "Kit to jump-start your Chrome extension projects with a variety of battle-tested starter templates & examples",
      link: "https://extensionkit.io/?ref=devportfolio",
      skills: ["React", "Node.js", "AWS"],
    },
  ],
  education: [
    {
      school: "NOVA School of Science and Technology",
      degree: "Integrated Master in Industrial Engineering and Management",
      dateRange: "September 2017 - September 2023",
      achievements: [
        "Master's Thesis focused on maintenance strategy optimization at Tetra Pak",
      ],
    },
    {
      school: "Ecole Nationale Supérieure en Génie des Systèmes et de l'Innovation",
      degree: "Erasmus+ Program",
      dateRange: "September 2021 - March 2022",
      achievements: [
        "Erasmus+ Program lasting 6 months",
        "All classes and exams done in French",
      ],
    },
  ],
};
