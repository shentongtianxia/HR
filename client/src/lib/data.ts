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
  },
  {
    id: "zhong-1",
    name: "钟先生",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces",
    title: "销售经理",
    experience: "7年经验",
    education: "本科",
    location: "广州",
    salary: "1.6-2万/月",
    status: "active",
    matchScore: 92,
    tags: ["锂电池辅材", "技术型销售", "TOP10客户资源", "化工材料"],
    summary: "7年经验，从售前技术支持转型销售，具备扎实的技术功底。熟悉锂电辅材（导电剂、粘接剂等），拥有EVB、EVE等行业头部客户资源。",
    details: {
      workHistory: [
        {
          company: "上海海逸科贸有限公司",
          role: "销售经理",
          period: "2024.11-至今",
          description: "负责锂电池华南区域客户开发与维护，服务行业TOP10客户；销售国外高端化学产品（IMERYS, Ashland, LG化学等）。"
        },
        {
          company: "广州集泰化工股份有限公司",
          role: "售前技术支持工程师",
          period: "2019.07-2023.10",
          description: "负责相关技术支持工作，积累了深厚的产品技术知识。"
        }
      ],
      education: [
        {
          school: "仲恺农业工程学院",
          degree: "本科 | 化学工程与工艺",
          period: "2017.09-2021.06"
        }
      ],
      skills: ["技术营销", "大客户维护", "化工产品知识", "市场拓展", "商务谈判"]
    }
  },
  {
    id: "dong-1",
    name: "董先生",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces",
    title: "销售经理",
    experience: "10年经验",
    education: "本科",
    location: "绵阳",
    salary: "1.5-2.3万/月",
    status: "active",
    matchScore: 90,
    tags: ["正极材料", "行业大厂", "高稳定性", "英语专业"],
    summary: "10年经验，深耕锂电池正极材料领域。在四川新锂想能源（行业大厂）任职8年，稳定性极高。英语专业背景，具备潜在的海外市场开发能力。",
    details: {
      workHistory: [
        {
          company: "四川新锂想能源科技有限责任公司",
          role: "销售经理",
          period: "2018.01-至今",
          description: "从事七年锂电池正极材料销售工作，积累了丰富的行业资源和销售经验。"
        }
      ],
      education: [
        {
          school: "武汉工程科技学院",
          degree: "本科 | 英语",
          period: "2010.09-2014.06"
        }
      ],
      skills: ["正极材料销售", "长期客户维护", "行业资源积累", "英语商务沟通"]
    }
  },
  {
    id: "chen-1",
    name: "陈先生",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces",
    title: "销售主管",
    experience: "12年经验",
    education: "大专",
    location: "广州",
    salary: "1.2-1.8万/月",
    status: "active",
    matchScore: 89,
    tags: ["锂电池PACK", "主机厂配套", "渠道销售", "工程机械"],
    summary: "12年经验，精通锂电池PACK定制及主机厂配套。拥有丰富的工程机械及相关零配件销售经验，手握主机厂配套客户资源。有车，适应出差。",
    details: {
      workHistory: [
        {
          company: "广东锂华新能源科技有限公司",
          role: "销售主管",
          period: "2024.03-至今",
          description: "开发主机厂及品牌方合作；管理销售团队；负责锂电池产品定制及标准产品销售；拓展高尔夫球车、电摩等应用市场。"
        },
        {
          company: "惠州市乐亿通科技有限公司",
          role: "销售工程师",
          period: "2022.02-2024.02",
          description: "开发新能源锂电池PACK定制客户；协调内部开发需求；参与产品调试测试；促成批量合作。"
        },
        {
          company: "上海宏信设备工程有限公司",
          role: "销售工程师",
          period: "2018.02-2021.11",
          description: "负责机械设备配件销售；开发市场，挖掘客户需求；解答疑问，成交客户并回款。"
        }
      ],
      education: [
        {
          school: "广东机电职业技术学院",
          degree: "大专 | 汽车服务工程",
          period: "2012.09-2015.06"
        }
      ],
      skills: ["PACK定制销售", "主机厂开发", "团队管理", "渠道拓展", "项目拜访"]
    }
  }
];
