import { drizzle } from 'drizzle-orm/mysql2';
import { candidates, workExperiences, educations, skills, aiEvaluations } from '../drizzle/schema.js';

const db = drizzle(process.env.DATABASE_URL);

// 候选人1：宁先生
const candidate1Data = {
  name: '宁先生',
  phone: '待解锁',
  email: '待解锁',
  location: '深圳',
  yearsOfExperience: 15,
  position: '高级项目经理/产品经理',
  expectedSalary: '24000-28000',
  summary: '15年3C消费类电子产品开发及IOT智能家居类项目开发管理经验，聚焦充电类产品：智能电工、快充移动电源、无线充、户外便携式储能、快充适配器、数据线等电源和智能家居类。持有NPDP证书（产品经理国际认证）、PMP证书（项目管理国际认证）。项目管理经验丰富，熟悉市场调研、产品定义和规划、立项、可行性评估、项目风险管理、资源调配及项目管理，熟悉从需求到量产全过程，多次新产品开发推向市场成功经验。',
  matchScore: 85,
  status: 'pending'
};

const candidate1WorkExps = [
  {
    company: '深圳市品奥科技有限公司',
    position: '产品经理/主管',
    startDate: '2023-11',
    endDate: '2025-12',
    description: '负责与运营部门对接，进行市场调研和品类洞察。负责公司产品线规划及产品定义。管理从产品预研、ID评审到产品量产的项目过程。主导开发V5三合一无线充、XP20D移动电源等产品。多个新产品进入德国BS前50、美国站BS前100，产品评分4.5以上。',
    responsibilities: '产品规划、市场调研、项目管理、产品开发'
  },
  {
    company: '乐歌人体工学科技股份有限公司深圳分公司',
    position: '产品经理',
    startDate: '2020-12',
    endDate: '2023-10',
    description: '参与深圳研发中心创建及部门规划。负责充电类产品线规划和项目开发整体管理。负责公司家庭储能及新能源方向产品线的产品调研和产品定义。负责带电源类升降桌产品线：无线充电智能升降桌、智能儿童学习桌等。',
    responsibilities: '产品线规划、项目管理、新能源产品开发'
  },
  {
    company: '河歌科技(深圳)有限责任公司',
    position: '产品经理',
    startDate: '2017-07',
    endDate: '2020-12',
    description: '负责充电类产品市场调研、需求分析、竞品分析。负责充电类和户外逆变储能类产品规划、选品、项目开发进度管理。负责执行新品的开发，优质供应链的导入与管理。',
    responsibilities: '市场调研、产品规划、供应链管理'
  },
  {
    company: '深圳罗马仕科技有限公司',
    position: '项目经理',
    startDate: '2014-05',
    endDate: '2017-06',
    description: '负责数码配件类新产品（移动电源/无线充电/智能穿戴/快充充电器/手机壳等）开发立项评审。负责项目实施（项目资源整合、整体进度跟进、异常处理、试产环节评审）。',
    responsibilities: '项目管理、产品开发、资源整合'
  }
];

const candidate1Education = {
  school: '广东财经大学',
  major: '市场营销',
  degree: '本科',
  startDate: '2016-09',
  endDate: '2020-12'
};

const candidate1Skills = [
  { name: '3C数码配件', level: 'expert' },
  { name: '移动电源', level: 'expert' },
  { name: '智能穿戴', level: 'expert' },
  { name: '项目管理', level: 'expert' },
  { name: '产品经理', level: 'expert' },
  { name: '供应链管理', level: 'advanced' }
];

// 候选人2：徐先生
const candidate2Data = {
  name: '徐先生',
  phone: '待解锁',
  email: '待解锁',
  location: '深圳-大鹏新区',
  yearsOfExperience: 5,
  position: '大客户销售',
  expectedSalary: '9000-12000',
  summary: '5年销售经验，曾在比亚迪半导体担任销售专员和销售工程师。负责智能传感器芯片与智慧照明灯具产品的销售工作，对接主机厂、代理商及建筑公司客户。智能传感器销售累计完成订单500+，月均销售额50万元以上。智慧照明产品销售累计完成订单2000+，月均销售额突破200万元。客户项目送样成功率提升臃60%，客户复购率提升25%。具备营销经验、熟练使用办公软件、持有C驾照、擅长面销/陌拜、会展销售、渠道销售。',
  matchScore: 92,
  status: 'pending'
};

const candidate2WorkExps = [
  {
    company: '比亚迪半导体股份有限公司',
    position: '销售专员',
    startDate: '2023-03',
    endDate: '2025-10',
    description: '负责智能传感器芯片与智慧照明灯具产品的销售工作，对接主机厂、代理商及建筑公司客户。智能传感器销售累计完成订单500+，月均销售额50万元以上。智慧照明产品销售累计完成订单2000+，月均销售额突破200万元。客户项目送样成功率提升至60%，客户复购率提升25%。',
    responsibilities: '大客户销售、渠道销售、客户关系管理、订单管理'
  },
  {
    company: '比亚迪半导体股份有限公司',
    position: '销售工程师',
    startDate: '2022-02',
    endDate: '至今',
    description: '负责车载产品智能传感器和工业储能产品智能传感器销售。对接主机厂客户及配合代理商销售传感器产品。处理询价单、送样测试，对接客户研发及采购人员进行产品介绍及技术交流。累计订单500+，月平均销售额50W+。智慧照明累计订单2000+，月平均销售额200W+。',
    responsibilities: '技术销售、客户开发、订单跟进、合同管理'
  },
  {
    company: '比亚迪半导体股份有限公司',
    position: '物流专员/助理',
    startDate: '2022-01',
    endDate: '2023-03',
    description: '负责日常物流单据处理与货物跟踪，日均处理发货单50+，确保订单准确率100%。协调调度物流车辆，优化配送路线，将平均货物在途时间缩短15%。',
    responsibilities: '物流管理、单据处理、货物跟踪'
  },
  {
    company: '中国平安保险股份有限公司',
    position: '客户经理',
    startDate: '2021-11',
    endDate: '2022-01',
    description: '负责通过互联网和电话形式挖掘客户，宣传及推广公司理财保险产品。任职期间完成3单业务，团队排名第三。负责客户咨询及答疑，持续跟踪客户需求变化，给客户制定产品方案。',
    responsibilities: '客户开发、产品推广、客户服务'
  }
];

const candidate2Education = {
  school: '合肥职业技术学院',
  major: '互联网金融',
  degree: '大专',
  startDate: '2019-09',
  endDate: '2022-06'
};

const candidate2Skills = [
  { name: '大客户销售', level: 'expert' },
  { name: '渠道销售', level: 'expert' },
  { name: '会展销售', level: 'advanced' },
  { name: '客户关系管理', level: 'expert' },
  { name: '营销经验', level: 'advanced' },
  { name: '面销/陌拜', level: 'advanced' }
];

async function importCandidates() {
  try {
    console.log('开始导入候选人数据...');

    // 导入候选人1：宁先生
    console.log('导入候选人1：宁先生');
    const [candidate1] = await db.insert(candidates).values(candidate1Data).$returningId();
    const candidate1Id = candidate1.id;

    // 导入宁先生的工作经历
    for (const exp of candidate1WorkExps) {
      await db.insert(workExperiences).values({
        ...exp,
        candidateId: candidate1Id
      });
    }

    // 导入宁先生的教育背景
    await db.insert(educations).values({
      ...candidate1Education,
      candidateId: candidate1Id
    });

    // 导入宁先生的技能
    for (const skill of candidate1Skills) {
      await db.insert(skills).values({
        ...skill,
        candidateId: candidate1Id
      });
    }

    // 生成宁先生的AI评价
    await db.insert(aiEvaluations).values({
      candidateId: candidate1Id,
      overallScore: 85,
      strengths: '行业头部企业工作经验（亿纬锂能、天能、罗马仕等），15年销售经验稳定性高。具备大客户开发与维护能力，擅长从0到1拓展新市场。持有PMP和NPDP认证，项目管理和产品管理能力强。熟悉3C数码配件、移动储能、智能穿戴等产品线，与公司业务高度匹配。',
      weaknesses: '学历档案仅为专本，非211/985背景，可能在高端客户场景中缺乏学历优势。期望薪资较高（2.4-2.8万/月），需要评估ROI。主要从事产品经理和项目管理，非纯销售岗位，需要适应销售角色。',
      suggestions: '建议安排面试重点考察其销售管理能力和团队协作能力。可以安排技术型销售或销售管理岗位，发挥其产品和项目管理优势。建议进行薪资谈判，评估其对销售岗位的适应性和意愿。',
      evaluatedAt: new Date()
    });

    console.log(`候选人1导入成功，ID: ${candidate1Id}`);

    // 导入候选人2：徐先生
    console.log('导入候选人2：徐先生');
    const [candidate2] = await db.insert(candidates).values(candidate2Data).$returningId();
    const candidate2Id = candidate2.id;

    // 导入徐先生的工作经历
    for (const exp of candidate2WorkExps) {
      await db.insert(workExperiences).values({
        ...exp,
        candidateId: candidate2Id
      });
    }

    // 导入徐先生的教育背景
    await db.insert(educations).values({
      ...candidate2Education,
      candidateId: candidate2Id
    });

    // 导入徐先生的技能
    for (const skill of candidate2Skills) {
      await db.insert(skills).values({
        ...skill,
        candidateId: candidate2Id
      });
    }

    // 生成徐先生的AI评价
    await db.insert(aiEvaluations).values({
      candidateId: candidate2Id,
      overallScore: 92,
      strengths: '行业头部企业（比亚迪半导体）销售经验，业绩优秀。月均销售额达200万+，累计订单2000+，数据表现突出。客户复购率提升25%，客户关系管理能力强。年轻（26岁）且积极找工作，可塑性强，稳定性好。具备大客户销售、渠道销售、会展销售等多种销售技能。',
      weaknesses: '学历为大专，可能在高端客户场景中存在学历劣势。工作年限较短（5年），行业深度和人脉资源可能不如资深销售。期望薪资9千-1.2万/月，与当前业绩水平相比偏低，可能存在其他考虑因素。',
      suggestions: '强烈推荐面试，重点考察其销售技巧和客户关系管理能力。可以安排销售岗位或大客户销售岗位，发挥其销售优势。建议了解其离职原因和职业规划，评估其稳定性和发展潜力。可以提供具有竞争力的薪资和发展空间，吸引其加入团队。',
      evaluatedAt: new Date()
    });

    console.log(`候选人2导入成功，ID: ${candidate2Id}`);

    console.log('所有候选人数据导入完成！');
    process.exit(0);
  } catch (error) {
    console.error('导入数据时出错：', error);
    process.exit(1);
  }
}

importCandidates();
