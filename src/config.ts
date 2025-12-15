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
    "I am a dedicated DevOps Engineer with over 3 years of experience in solution architecture and infrastructure deployment. In my current role at Akkodis, I am responsible for architecting and deploying solutions on cloud (AWS) and on-premise environments using tools like Terraform, Ansible, Kubernetes, Docker, Prometheus, Grafana and Python.",
  skills: ["Solutions Architect", "AWS", "Terraform", "Kubernetes", "Docker"],
  experience: [
    {
      company: "Akkodis",
      title: "DevOps Engineer",
      dateRange: "January 2025 - Present",
      bullets: [
        "Led technical workshops for deploying a healthcare solution on Red Hat OpenShift clusters",
        "Architected the migration from an on-premise environment to an Amazon EKS infrastructure",
        "Deployed a logging pipeline using Fluent Bit, Kafka, and OpenSearch on Kubernetes",
        "Implemented a GitOps CI/CD pipeline with ArgoCD to automate deployments",
        "Provided on-call support and incident response for applications in production",
      ],
    },
    {
      company: "KPMG Portugal",
      title: "Technology Consultant",
      dateRange: "October 2022 - January 2025",
      bullets: [
        "Execution of an end-to-end migration of a core banking system from on-premise to a hybrid cloud environment",
        "Conducted workshops with clients to design scalable cloud solutions aligned with their business objectives",
        "Definition of CI/CD pipelines strategies to automate the software delivery process",
        "Collaborated with cross-functionally teams and translated customer feedback into actionable product requirements",
      ],
    },
    {
      company: "Tetra Pak",
      title: "Master Thesis Internship",
      dateRange: "March 2022 - August 2022",
      bullets: [
        "Development and implementation of a project for the master's thesis",
        "Conducted analysis and optimization of maintenance strategies to enhance system reliability and efficiency",
      ],
    },
  ],
  projects: [
    {
      name: "Self-Hosted Infrastructure (Homelab) on a 3 Node Raspberry Pi Cluster",
      description:
        "Deployed a 3 node bare metal Kubernetes cluster to replicate a real production environment, from hardware assembly to system configuration. Automated application deployment via a GitOps workflow with ArgoCD and Helm Charts. Architected the core networking stack, integrating load balancing (MetalLB), HTTP/HTTPS routing and ingress control (NGINX) and automated TLS management (Cert-Manager). Implemented a monitoring dashboard with Prometheus and Grafana",
      link: "https://github.com/diogofrmota/homelab",
      skills: ["Kubernetes", "Linux", "Automation", "Networking", "Solution Architecture"],
    },
    {
      name: "Full Monitoring Pipeline",
      description:
        "Built a complete Kubernetes monitoring stack with Prometheus, AlertManager, and Grafana using Helm. Prometheus scrapes cluster metrics, AlertManager handles notifications, and Grafana provides real-time dashboards for system observability.",
      link: "https://github.com/diogofrmota/monitoring-pipeline-in-kubernetes",
      skills: ["Kubernetes", "Prometheus", "AlertManager", "Grafana"],
    },
    {
      name: "High Availability MongoDB Cluster",
      description:
        "Deployed a high availability MongoDB cluster (3-node replica set) using Docker Compose with automated backups and real-time data replication for fault tolerance.",
      link: "https://github.com/diogofrmota/docker-compose",
      skills: ["MongoDB", "Docker Compose", "Encryption", "Data Replication", "Backup Automation"],
    },
  ],
  education: [
    {
      school: "NOVA School of Science and Technology",
      degree: "Integrated Master in Industrial Engineering and Management",
      dateRange: "September 2017 - September 2023",
      achievements: [
        "Elected Chief Presiding Officer of NEGI (Núcleo de Engenharia e Gestão Industrial)",
        "Awarded 1st place at NOVA FCT Entrepreneurship Program",
      ],
    },
    {
      school: "Ecole Nationale Supérieure en Génie des Systèmes et de l'Innovation",
      degree: "Erasmus+ Program",
      dateRange: "September 2021 - March 2022",
      achievements: [
        "Erasmus+ Program at Nancy, France",
        "All classes and exams done in French",
      ],
    },
  ],
};
