export interface NavLink {
  label: string
  href: string
}

export interface Service {
  title: string
  description: string
  bullets: string[]
}

export interface Project {
  title: string
  client: string
  category: string
  description: string
  tags: string[]
  metric: string
  metricLabel: string
}

export interface Stat {
  value: string
  label: string
}

export interface ProcessStep {
  title: string
  description: string
}

export interface FaqItem {
  question: string
  answer: string
}

export const brand: { name: string; tagline: string; email: string } = {
  name: 'swat dev',
  tagline: 'We turn AI prototypes into production systems that move real numbers.',
  email: 'hello@swatdev.ai',
}

export const nav: NavLink[] = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
]

export const hero: {
  eyebrow: string
  titleLines: string[]
  subtitle: string
  primaryCta: string
  secondaryCta: string
} = {
  eyebrow: 'AI consulting & engineering studio',
  titleLines: ['We build', 'production AI', 'that ships.'],
  subtitle:
    'swat dev is a senior team of AI engineers who take you from idea to deployed system. RAG, agents, and ML platforms built to survive real users and real scale.',
  primaryCta: 'Start a project',
  secondaryCta: 'See our work',
}

export const stats: Stat[] = [
  { value: '40+', label: 'AI systems shipped to production' },
  { value: '12 wks', label: 'average time to first deploy' },
  { value: '99.9%', label: 'uptime across delivered platforms' },
  { value: '8 yrs', label: 'median engineer experience' },
]

export const services: Service[] = [
  {
    title: 'AI Strategy & Roadmap',
    description:
      'We pressure-test your AI ambitions against ROI, risk, and feasibility before a line of code is written.',
    bullets: [
      'Use-case discovery and prioritization',
      'Build-vs-buy and model selection',
      'ROI modeling and adoption roadmap',
    ],
  },
  {
    title: 'LLM & Agent Development',
    description:
      'Production agents and copilots that reason, use tools, and act reliably inside your workflows.',
    bullets: [
      'Multi-agent orchestration and tool use',
      'Guardrails, fallbacks, and human-in-the-loop',
      'Latency and cost optimization',
    ],
  },
  {
    title: 'RAG & Knowledge Systems',
    description:
      'Retrieval pipelines that answer from your data with citations you can actually trust.',
    bullets: [
      'Hybrid search and intelligent re-ranking',
      'Semantic chunking and metadata capture',
      'Citation accuracy and hallucination control',
    ],
  },
  {
    title: 'ML Platform & MLOps',
    description:
      'The infrastructure that turns one-off models into a repeatable, observable delivery engine.',
    bullets: [
      'CI/CD for models and prompts',
      'Feature stores and scalable serving',
      'Monitoring, tracing, and drift detection',
    ],
  },
  {
    title: 'Data & Evaluation',
    description:
      'Rigorous eval harnesses that gate every release so quality is measured, not guessed.',
    bullets: [
      'Versioned ground-truth datasets',
      'Automated eval and regression gates',
      'SME review and labeling workflows',
    ],
  },
  {
    title: 'Fine-Tuning & Optimization',
    description:
      'Smaller, faster, cheaper models tuned to your domain without sacrificing quality.',
    bullets: [
      'Fine-tuning, LoRA, and distillation',
      'Quantization and inference tuning',
      'Self-hosted and managed deployment',
    ],
  },
]

export const projects: Project[] = [
  {
    title: 'Citation-grounded research copilot',
    client: 'Global management consultancy',
    category: 'RAG',
    description:
      'Built a knowledge platform over 2M+ internal documents with permission-aware retrieval and source-cited answers, cutting scoping work from days to hours.',
    tags: ['Hybrid search', 'Re-ranking', 'Citations', 'Access control'],
    metric: '85%',
    metricLabel: 'faster research-to-deck',
  },
  {
    title: 'Autonomous support resolution agent',
    client: 'Series B fintech',
    category: 'Agents',
    description:
      'Deployed a multi-agent support copilot with tool use and human-in-the-loop escalation that resolves routine tickets end to end.',
    tags: ['Multi-agent', 'Tool use', 'Guardrails', 'LLM'],
    metric: '92%',
    metricLabel: 'tier-1 tickets auto-resolved',
  },
  {
    title: 'Unified model serving platform',
    client: 'Enterprise SaaS company',
    category: 'ML Platform',
    description:
      'Replaced fragmented notebooks with a governed platform for training, serving, and monitoring, taking new models from weeks to a day.',
    tags: ['MLOps', 'Feature store', 'Observability', 'Kubernetes'],
    metric: '6x',
    metricLabel: 'faster model deployment',
  },
  {
    title: 'Real-time visual defect detection',
    client: 'Industrial manufacturer',
    category: 'Computer Vision',
    description:
      'Shipped an edge vision system that flags defects on the production line in real time, slashing escaped defects and manual inspection load.',
    tags: ['Vision', 'Edge inference', 'Active learning', 'PyTorch'],
    metric: '-73%',
    metricLabel: 'defects reaching customers',
  },
  {
    title: 'Demand forecasting engine',
    client: 'Global logistics company',
    category: 'Forecasting',
    description:
      'Built a probabilistic forecasting system across thousands of SKUs and lanes, tightening inventory and reducing stockouts.',
    tags: ['Time series', 'Probabilistic', 'Feature pipelines', 'Airflow'],
    metric: '31%',
    metricLabel: 'reduction in stockouts',
  },
  {
    title: 'Automated claims intake',
    client: 'National insurance provider',
    category: 'Document Intelligence',
    description:
      'Automated extraction and validation across messy PDFs and scans, routing clean structured data straight into core systems.',
    tags: ['OCR', 'Extraction', 'Validation', 'LLM'],
    metric: '3.4x',
    metricLabel: 'faster claim processing',
  },
]

export const processSteps: ProcessStep[] = [
  {
    title: 'Discover',
    description:
      'We map the highest-ROI use cases, define success metrics, and align on scope before building anything.',
  },
  {
    title: 'Prototype',
    description:
      'We ship a working prototype in weeks and prove value against real data and real evaluations.',
  },
  {
    title: 'Productionize',
    description:
      'We harden the system with guardrails, monitoring, and eval gates so it survives real users.',
  },
  {
    title: 'Scale',
    description:
      'We optimize cost and latency, hand off cleanly, and support your team as adoption grows.',
  },
]

export const faqs: FaqItem[] = [
  {
    question: 'How do you typically engage?',
    answer:
      'Most clients start with a fixed-scope discovery sprint, then move into a build engagement. We work as an embedded senior team alongside your people, not a black box.',
  },
  {
    question: 'How fast can we see something working?',
    answer:
      'A working prototype usually lands within the first few weeks, and most systems reach production in around 12 weeks depending on scope and data readiness.',
  },
  {
    question: 'How do you price projects?',
    answer:
      'We scope and price per engagement, not by the hour. You get a clear deliverable, timeline, and budget upfront so there are no surprises.',
  },
  {
    question: 'How do you handle data security?',
    answer:
      'We work inside your cloud and security boundaries, support self-hosted models, and enforce access controls and audit logging at the retrieval layer.',
  },
  {
    question: 'Who actually does the work?',
    answer:
      'Senior AI engineers with production track records. No layered subcontracting and no junior teams learning on your project.',
  },
]

export const contact: {
  heading: string
  subheading: string
  buttonLabel: string
} = {
  heading: "Let's build something that ships.",
  subheading:
    'Tell us what you are trying to build. Drop your email and we will get back within one business day.',
  buttonLabel: 'Get in touch',
}
