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
    "I am a dedicated DevOps Engineer with over 3 years of experience in solution architecture and infrastructure deployment. In my current role at Akkodis, I am responsible for architecting and deploying solutions on cloud and on-premise environments using tools like AWS, Terraform, Ansible, Kubernetes, Docker, Prometheus, Grafana and Python.",
  skills: ["Solutions Architect", "AWS", "Terraform", "Kubernetes", "Docker"],
  experience: [
    {
      company: "Akkodis",
      title: "DevOps Engineer",
      dateRange: "January 2025 - Present",
      bullets: [
        "Led technical workshops for the deployment of a healthcare solution on Red Hat OpenShift clusters",
        "Migration of a log aggregation pipeline to AWS deployed on EKS using Kafka and OpenSearch",
        "Architecture of a GitOps CI/CD pipeline with ArgoCD and GitHub Actions",
        "Provisioning of high-availability PostgreSQL and MongoDB databases with encryption using Docker Compose",
        "Automation of repetitive tasks using Python and Bash scripts",
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
      name: "Self-Hosted Infrastructure (Homelab)",
      description:
        "Configured a Raspberry Pi 3B+ as bare-metal, headless Debian server with a dashboard for monitoring updates, networking, and storage. Automated smart home IoT lights and switches based on sunrise, sunset, and custom rules using lightweight scheduling.",
      link: "https://github.com/diogofrmota/homelab",
      skills: ["Docker", "Kubernetes", "Linux", "Monitoring", "Networking"],
    },
    {
      name: "Full Monitoring Pipeline",
      description:
        "Built a complete Kubernetes monitoring stack with Prometheus, AlertManager, and Grafana on Minikube using Helm. Prometheus scrapes cluster metrics, AlertManager handles notifications, and Grafana provides real-time dashboards for system observability.",
      link: "https://github.com/diogofrmota/monitoring-pipeline-in-kubernetes",
      skills: ["Kubernetes", "Prometheus", "AlertManager", "Grafana"],
    },
    {
      name: "High Availability MongoDB Cluster",
      description:
        "Deployed a high availability MongoDB cluster (3-node replica set) using Docker Compose with automated backups and real-time data replication for fault tolerance.",
      link: "https://github.com/diogofrmota/docker-compose",
      skills: ["MongoDB", "Docker Compose", "Data Replication", "Backup Automation"],
    },
  ],
  education: [
    {
      school: "NOVA School of Science and Technology",
      degree: "Integrated Master in Industrial Engineering and Management",
      dateRange: "September 2017 - September 2023",
      achievements: [
        "Member of NEGI (Núcleo de Engenharia e Gestão Industrial) for 4 years",
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
