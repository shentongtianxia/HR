import { Candidate } from "../types";

export const candidates: Candidate[] = [
  {
    id: "dou-1",
    name: "窦先生",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces",
    title: "销售经理",
    experience: "15年经验",
    education: "本科",
    location: "滁州",
    salary: "1-1.2万/月",
    status: "active",
    matchScore: 95,
    tags: ["锂电池销售", "大客户开发", "团队管理", "市场调研"],
    summary: "15年销售经验，深耕锂电行业。曾任职亿纬锂能、天能电源等头部企业，具备丰富的大客户开发与维护经验。擅长销售战略制定与团队管理。",
    details: {
      workHistory: [
        {
          company: "惠州亿纬锂能股份有限公司",
          role: "销售经理",
          period: "2023.04-至今",
          description: "负责锂电池销售，根据销售战略完成销售任务；独立开发2B市场KA客户；建立客户档案并保持良好客情关系。"
        },
        {
          company: "浙江省长兴天能电源有限公司",
          role: "销售经理",
          period: "2017.11-2023.03",
          description: "负责锂电池市场拓展，制定销售目标与拓展策略；独立进行项目销售并指导团队。"
        },
        {
          company: "安徽古井集团",
          role: "销售经理",
          period: "2011.12-2017.08",
          description: "负责代理商管理及渠道拓展；策划执行区域内销售活动。"
        }
      ],
      education: [
        {
          school: "杭州电子科技大学",
          degree: "本科 | 市场营销",
          period: "2021.09-2024.06"
        },
        {
          school: "安徽新华学院",
          degree: "大专 | 应用电子技术",
          period: "2008.09-2011.07"
        }
      ],
      skills: ["销售战略", "KA客户开发", "团队建设", "商业谈判", "市场分析"]
    }
  },
  {
    id: "zhao-1",
    name: "赵先生",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces",
    title: "销售经理",
    experience: "6年经验",
    education: "大专",
    location: "重庆",
    salary: "8千-1.6万/月",
    status: "interviewing",
    matchScore: 88,
    tags: ["新能源供应链", "物流销售", "客户深耕", "招投标"],
    summary: "6年经验，专注于新能源供应链销售与服务。曾服务多家锂电头部企业，擅长全流程客户管理与复杂业务落地。关键客户续约率达100%。",
    details: {
      workHistory: [
        {
          company: "重庆必需道供应链管理有限公司",
          role: "销售经理",
          period: "2023.07-至今",
          description: "负责新能源锂电头部客户开发与维护；参与招投标与项目突破；关键客户续约率100%，业务量年均增长超15%。"
        },
        {
          company: "招商局物流集团重庆有限公司",
          role: "物流经理",
          period: "2020.07-2023.05",
          description: "负责大型企业客户综合物流项目管理；建立季度复盘机制，客户满意度95%+；获公司'成本控制优秀奖'。"
        }
      ],
      education: [
        {
          school: "重庆城市管理职业学院",
          degree: "大专 | 工商管理",
          period: "2017.09-2020.06"
        }
      ],
      skills: ["供应链销售", "客户关系维护", "招投标管理", "物流方案设计", "成本控制"]
    }
  }
];
