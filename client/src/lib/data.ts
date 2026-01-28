import { Candidate } from "../types";

// 统一的默认头像（中性灰色人像）
const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=e2e8f0&color=64748b&name=";

const rawCandidates: Candidate[] = [
  {
    id: "dou-1",
    name: "窦先生",
    avatar: "", // 将在下方统一处理
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
    },
    aiEvaluation: {
      score: 95,
      summary: "资深锂电销售专家，具备头部企业背景和丰富的KA资源，非常适合需要快速拓展大客户的团队。",
      pros: ["行业头部企业（亿纬锂能、天能）背景，资源丰富", "15年销售经验，稳定性高", "具备团队管理和战略制定能力"],
      cons: ["学历背景一般（专升本），但经验可弥补", "期望薪资相对较低，需确认是否有其他诉求"],
      suggestion: "强烈推荐面试。重点考察其在亿纬锂能期间的具体业绩和客户资源转化能力。"
    }
  },
  {
    id: "zhao-1",
    name: "赵先生",
    avatar: "",
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
    },
    aiEvaluation: {
      score: 88,
      summary: "专注于供应链服务的销售人才，服务意识强，客户满意度高，适合维护型销售岗位。",
      pros: ["客户续约率100%，服务意识极强", "熟悉招投标流程和物流管理", "年轻有冲劲，学习能力强"],
      cons: ["纯锂电产品销售经验相对较少", "大专学历，可能受限于部分企业门槛"],
      suggestion: "建议面试。考察其从服务型销售向产品型销售转型的潜力。"
    }
  },
  {
    id: "zhong-1",
    name: "钟先生",
    avatar: "",
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
    },
    aiEvaluation: {
      score: 92,
      summary: "技术型销售人才，懂技术懂产品，适合销售高技术门槛的锂电材料。",
      pros: ["技术背景深厚（售前转销售），沟通更有说服力", "手握TOP10客户资源", "本科化工专业，专业对口"],
      cons: ["纯销售经验年限相对较短（转型不久）", "近期跳槽较快（2024.11至今），需关注稳定性"],
      suggestion: "推荐面试。重点考察其销售技巧和抗压能力，以及离职原因。"
    }
  },
  {
    id: "dong-1",
    name: "董先生",
    avatar: "",
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
    },
    aiEvaluation: {
      score: 90,
      summary: "极具稳定性的资深销售，深耕正极材料领域，适合需要长期稳定发展的岗位。",
      pros: ["稳定性极高（一份工作8年）", "正极材料领域专家", "英语专业，有海外拓展潜力"],
      cons: ["工作经历相对单一，可能适应新环境较慢", "年龄33岁，需考察其进取心"],
      suggestion: "推荐面试。考察其英语能力和对新市场的开拓意愿。"
    }
  },
  {
    id: "chen-1",
    name: "陈先生",
    avatar: "",
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
    },
    aiEvaluation: {
      score: 89,
      summary: "实战派销售主管，擅长主机厂配套和渠道开发，资源变现能力强。",
      pros: ["主机厂配套经验丰富", "有带团队经验", "适应出差，执行力强"],
      cons: ["大专学历", "近期工作变动较频繁"],
      suggestion: "建议面试。适合需要快速出业绩、能吃苦的销售岗位。"
    }
  },
  {
    id: "wu-1",
    name: "吴女士",
    avatar: "",
    title: "外贸销售",
    experience: "8年经验",
    education: "本科",
    location: "广州",
    salary: "1-1.5万/月",
    status: "active",
    matchScore: 94,
    tags: ["阿里巴巴国际站", "中国制造网", "客户开发", "英语六级"],
    summary: "8年外贸经验，精通B2B平台运营与客户开发。在广州鑫衍运动用品任职6年，稳定性极高。英语六级，沟通无障碍。",
    details: {
      workHistory: [
        {
          company: "广州鑫衍运动用品有限公司",
          role: "外贸销售",
          period: "2019.05-至今",
          description: "负责阿里巴巴国际站及中国制造网平台运营；独立开发海外客户，跟进询盘至成交；维护老客户关系，提升复购率。"
        }
      ],
      education: [
        {
          school: "广东外语外贸大学",
          degree: "本科 | 商务英语",
          period: "2016.09-2020.06"
        }
      ],
      skills: ["B2B平台运营", "商务英语谈判", "客户关系管理", "外贸全流程"]
    },
    aiEvaluation: {
      score: 94,
      summary: "资深外贸销售，平台运营经验丰富，稳定性极佳，适合需要长期深耕的外贸团队。",
      pros: ["8年经验且单份工作长达6年，稳定性极高", "精通主流B2B平台（阿里、中国制造网）", "广外商务英语专业，语言能力强"],
      cons: ["工作经历相对单一，可能对其他行业适应需时间"],
      suggestion: "强烈推荐面试。重点考察其在平台运营方面的具体数据表现（如询盘转化率）。"
    }
  },
  {
    id: "he-1",
    name: "贺女士",
    avatar: "",
    title: "外贸业务经理",
    experience: "18年经验",
    education: "本科",
    location: "青岛",
    salary: "1.2-2.4万/月",
    status: "active",
    matchScore: 91,
    tags: ["纺织服装", "询盘报价", "跟单管理", "行业资深"],
    summary: "18年纺织服装行业外贸经验，从跟单助理成长为业务经理。精通从询盘报价到出货回款的全流程管理。",
    details: {
      workHistory: [
        {
          company: "青岛爱尔发纺织有限公司",
          role: "外贸销售",
          period: "2023.12-至今",
          description: "负责纺织品外贸销售，开发新客户，维护老客户。"
        },
        {
          company: "青岛兆明针织有限公司",
          role: "外贸业务经理",
          period: "2023.07-2023.12",
          description: "管理外贸团队，制定销售目标，审核报价与合同。"
        }
      ],
      education: [
        {
          school: "青岛科技大学",
          degree: "本科 | 工商管理",
          period: "2003.09-2007.09"
        }
      ],
      skills: ["纺织行业知识", "全流程管理", "报价策略", "团队协作"]
    },
    aiEvaluation: {
      score: 91,
      summary: "行业老兵，深耕纺织服装领域18年，经验无可替代，适合需要带新人的管理岗位或高级销售岗。",
      pros: ["18年行业经验，极其资深", "熟悉外贸全流程，无需培训", "具备管理经验"],
      cons: ["近期工作变动稍频繁（2023年至今两份）", "年龄41岁，需确认其精力与冲劲"],
      suggestion: "建议面试。重点考察其近期离职原因及对新工作的期望稳定性。"
    }
  },
  {
    id: "s-1",
    name: "S女士",
    avatar: "",
    title: "外贸专员",
    experience: "9年经验",
    education: "本科",
    location: "珠海",
    salary: "1-1.3万/月",
    status: "active",
    matchScore: 89,
    tags: ["日语", "海外客户开发", "合同制定", "双语优势"],
    summary: "9年外贸经验，具备英语与日语双语优势。在珠海华粤传动科技任职8年，稳定性极高。擅长开发海外客户与合同制定。",
    details: {
      workHistory: [
        {
          company: "珠海华粤传动科技有限公司",
          role: "外贸专员",
          period: "2017.10-至今",
          description: "负责海外市场拓展，利用双语优势开发客户；制定并审核外贸合同，规避风险。"
        }
      ],
      education: [
        {
          school: "广东海洋大学寸金学院",
          degree: "本科 | 英语",
          period: "2013.09-2017.06"
        }
      ],
      skills: ["日语商务沟通", "英语商务沟通", "合同风险管理", "客户开发"]
    },
    aiEvaluation: {
      score: 89,
      summary: "双语复合型人才，稳定性极高，适合需要拓展日本市场或多语言环境的企业。",
      pros: ["9年经验且单份工作8年，忠诚度高", "具备日语+英语双语能力，稀缺性强"],
      cons: ["职位一直为专员/助理，需确认是否有晋升意愿"],
      suggestion: "推荐面试。考察其语言实际应用能力及职业规划。"
    }
  },
  {
    id: "wei-1",
    name: "魏先生",
    avatar: "",
    title: "外贸专员",
    experience: "10年经验",
    education: "本科",
    location: "深圳",
    salary: "1-1.5万/月",
    status: "active",
    matchScore: 87,
    tags: ["平台操作", "客户开发", "电路板行业", "长期稳定"],
    summary: "10年外贸经验，深耕电路板行业。在深圳汇和精密电路任职9年，稳定性极高。精通外贸平台操作与客户开发。",
    details: {
      workHistory: [
        {
          company: "深圳汇和精密电路有限公司",
          role: "外贸专员",
          period: "2016.06-至今",
          description: "负责公司外贸部日常运营；操作B2B平台，发布产品；开发并维护海外客户。"
        }
      ],
      education: [
        {
          school: "湖北汽车工业学院",
          degree: "本科 | 国际经济与贸易",
          period: "2012.09-2016.06"
        }
      ],
      skills: ["电子行业外贸", "平台运营", "客户维护", "订单处理"]
    },
    aiEvaluation: {
      score: 87,
      summary: "极具稳定性的电子行业外贸人才，适合需要长期沉淀的岗位。",
      pros: ["10年经验，单份工作9年，稳定性极佳", "深耕电路板行业，专业度高"],
      cons: ["一直在同一家公司，可能思维模式较固化"],
      suggestion: "建议面试。考察其对新环境的适应能力及创新思维。"
    }
  },
  {
    id: "j-1",
    name: "J女士",
    avatar: "",
    title: "外贸经理",
    experience: "8年经验",
    education: "本科",
    location: "上海",
    salary: "1.8-2.5万/月",
    status: "active",
    matchScore: 93,
    tags: ["电线电缆", "211院校", "外贸开发", "业务管理"],
    summary: "8年外贸经验，毕业于东华大学（211）。在上海浦东电线电缆集团任职7年，从专员成长为经理。具备优秀的业务开发与管理能力。",
    details: {
      workHistory: [
        {
          company: "上海浦东电线电缆（集团）有限公司",
          role: "外贸专员/经理",
          period: "2018.10-至今",
          description: "负责外贸业务全面管理；制定出口策略；带领团队完成销售指标；维护核心大客户。"
        }
      ],
      education: [
        {
          school: "东华大学",
          degree: "本科 | 国际经济与贸易",
          period: "2014.09-2018.06"
        }
      ],
      skills: ["团队管理", "大客户谈判", "行业洞察", "战略规划"]
    },
    aiEvaluation: {
      score: 93,
      summary: "高素质外贸管理人才，学历背景好，稳定性高，适合作为外贸团队核心骨干。",
      pros: ["211院校科班出身，基础扎实", "7年大厂经验，稳定性高", "具备管理潜质"],
      cons: ["薪资期望相对较高"],
      suggestion: "强烈推荐面试。重点考察其管理理念和过往业绩的含金量。"
    }
  }
];

// 数据去重逻辑：使用Map以ID为键进行去重
const uniqueCandidatesMap = new Map<string, Candidate>();
rawCandidates.forEach(candidate => {
  if (!uniqueCandidatesMap.has(candidate.id)) {
    // 统一设置头像
    candidate.avatar = `${DEFAULT_AVATAR}${encodeURIComponent(candidate.name)}`;
    uniqueCandidatesMap.set(candidate.id, candidate);
  }
});

export const candidates: Candidate[] = Array.from(uniqueCandidatesMap.values());
