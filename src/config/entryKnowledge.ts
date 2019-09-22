/**
 * 入口实验--温故知新富文本数据
 */
export const entryKnowledge = [
  {
    title: '介绍',
    content: `<p style="text-indent: 2em;">
                搜索引擎是指根据一定的策略、运用特定的计算机程序从互联网上采集信息，在对信息进行组织和处理后，为用户提供检索服务，将检索的相关信息展示给用户的系统。搜索引擎是工作于互联网上的一门检索技术，它旨在提高人们获取搜集信息的速度，为人们提供更好的网络使用环境。网络搜索引擎（谷歌、百度、中国知网、Web of Science、微信搜一搜等）是获取各类互联网大数据的门户，是各类互联网应用的基石。掌握网络搜索引擎构架、了解信息检索技术、掌握构建信息检索系统的方法是信息管理与信息系统专业学生的所必须的基本素养。
              </p>
              <p style="text-indent: 2em;">
                本实验建立了包括索引器，检索器，评价器，仿真单元的检索系统架构模型。索引器部分包括基于Lucene 结合IK，jieba，hanlp等主流中文分词工具建立的预处理器模块，和基于倒排索引方法，通过统计学的方法建立的索引模块。检索器部分包括通过统计学方法建立的布尔模型模块，基于TF-IDF算法建立的向量空间模型模块，基于BM25算法建立的概率检索模型模块和基于概率估计方法建立语言模型模块。评价器部分全面综合了有关评价指标，包括传统的正确率、召回率、F1值，MAP（平均正确率均值）以及一种常用于机器学习排序算法的评价指标NDCG（归一化折损累计增益），同时对检索模型返回的前5项，前10项和前20项的指标进行了重点关注。仿真单元部分，在后端对学生建立的模型自动进行集成封装以提供检索服务接口，利用HTML5、NodeJs、React、BootStrap等先进技术对标主流搜素引擎进行仿真，对检索系统进行真实还原。
              </p>
              <p style="text-indent: 2em;">
                本实验流程为：构建索引器（构建预处理器、构建倒排索引表）、构建检索器（构建布尔模型、构建向量空间模型、构建概率检索模型、构建语言模型）、分析检索模型性能、仿真搜索引擎。
              </p>`
  },
  {
    title: '相关技术',
    content: `<p>
                <strong>Lucene</strong>
              </p>
              <p style="text-indent: 2em;">
                Lucene是apache软件基金会4 jakarta项目组的一个子项目，是一个开放源代码的全文检索引擎工具包，但它不是一个完整的全文检索引擎，而是一个全文检索引擎的架构，提供了完整的查询引擎和索引引擎，部分文本分析引擎（英文与德文两种西方语言）。Lucene的目的是为软件开发人员提供一个简单易用的工具包，以方便的在目标系统中实现全文检索的功能，或者是以此为基础建立起完整的全文检索引擎。Lucene是一套用于全文检索和搜寻的开源程式库，由Apache软件基金会支持和提供。Lucene提供了一个简单却强大的应用程式接口，能够做全文索引和搜寻。在Java开发环境里Lucene是一个成熟的免费开源工具。就其本身而言，Lucene是当前以及最近几年最受欢迎的免费Java信息检索程序库。人们经常提到信息检索程序库，虽然与搜索引擎有关，但不应该将信息检索程序库与搜索引擎相混淆。
              </p>`
  },
  {
    title: 'Lucene执行原理',
    content: `<p style="text-align: left;">
                <strong>1、索引和搜索原理</strong>
              </p>
              <p style="text-align: center;">
                <img src="https://t1.picb.cc/uploads/2019/07/26/grGtkc.png" style="max-width: 100%;">
              </p>
              <p style="text-align: center;">
                <strong>图表 1&nbsp;</strong>Principle of Index
              </p>
              <p style="text-align: left;">
                绿色表示索引过程，对要搜索的原始内容进行索引构建一个索引库，索引过程包括：确定原始内容即要搜索的内容、采集文档、创建文档、分析文档、索引文档。红色表示搜索过程，从索引库中搜索内容，搜索过程包括：用户通过搜索界面、创建查询、执行搜索、从索引库搜索、渲染搜索结果。
              </p>
              <p style="text-align: left;">
                <strong>2、创建索引</strong>
              </p>
              <p style="text-align: left;">
                创建索引是对文档索引的过程，将用户要搜索的文档内容进行索引，索引存储在索引库（index）中。
              </p>
              <p style="text-align: left;">
                1）获取原始文档
              </p>
              <p style="text-align: left;text-indent: 2em;">
                原始文档是指要索引和搜索的内容。原始内容包括互联网上的网页（爬虫）、数据库中的数据（sql查询）、磁盘上的文件（IO流获取）等。从互联网上、数据库、文件系统中等获取需要搜索的原始信息，这个过程就是信息采集，信息采集的目的是为了对原始内容进行索引。在Internet上采集信息的软件通常称为爬虫或蜘蛛，也称为网络机器人，爬虫访问互联网上的每一个网页，将获取到的网页内容存储起来。
              </p>
              <p style="text-align: left;">
                2）创建文档对象
              </p>
              <p style="text-align: left; text-indent: 2em;">
                获取原始内容的目的是为了索引，在索引前需要将原始内容创建成文档（Document），文档中包括一个一个的域（Field），域中存储内容。
              </p>
              <p style="text-align: left; text-indent: 2em;">
                这里我们可以将磁盘上的一个文件当成一个document，Document中包括一些Field（file_name文件名称、file_path文件路径、file_size文件大小、file_content文件内容），如下图：
              </p>
              <p style="text-align: center;">
                <img src="https://t1.picb.cc/uploads/2019/07/26/grGZHK.png" style="max-width: 100%;">
              </p>
              <p style="text-align: center;">
                <strong>图表 2&nbsp;</strong>Document
              </p>
              <p style="text-align: left;">
                3）分析文档
              </p>
              <p style="text-align: left; text-indent: 2em;">
                将原始内容创建为包含域（Field）的文档（document），需要再对域中的内容进行分析，分析的过程是经过对原始文档提取单词、将字母转为小写、去除标点符号、去除停用词等过程生成最终的语汇单元，可以将语汇单元理解为一个一个的单词。
              </p>
              <p style="text-align: left;">
                4）创建索引
              </p>
              <p style="text-align: left; text-indent: 2em;">
                对所有文档分析得出的语汇单元进行索引，索引的目的是为了搜索，最终要实现只搜索被索引的语汇单元从而找到Document（文档）。
              </p>
              <p style="text-align: left;">
                <strong>3、查询索引</strong>
              </p>
              <p style="text-align: left; text-indent: 2em;">
                查询索引也是搜索的过程。搜索就是用户输入关键字，从索引（index）中进行搜索的过程。根据关键字搜索索引，根据索引找到对应的文档，从而找到要搜索的内容（这里指磁盘上的文件）。
              </p>
              <p style="text-align: left;">
                1）用户查询接口
              </p>
              <p style="text-align: left; text-indent: 2em;">
                全文检索系统提供用户搜索的界面供用户提交搜索的关键字，搜索完成展示搜索结果。
              </p>
              <p style="text-align: left;">
                2）创建查询
              </p>
              <p style="text-align: left; text-indent: 2em;">
                用户输入查询关键字执行搜索之前需要先构建一个查询对象，查询对象中可以指定查询要搜索的Field文档域、查询关键字等，查询对象会生成具体的查询语法。
              </p>
              <p style="text-align: left;">
                3）执行查询
              </p>
              <p style="text-align: left; text-indent: 2em;">
                搜索索引过程：根据查询语法在倒排索引词典表中分别找出对应搜索词的索引，从而找到索引所链接的文档链表。
              </p>
              <p style="text-align: left;">
                4）渲染结果
              </p>
              <p style="text-align: left;">
                以一个友好的界面将查询结果展示给用户，用户根据搜索结果找自己想要的信息，为了帮助用户很快找到自己的结果，提供了很多展示的效果，比如搜索结果中将关键字高亮显示，百度提供的快照等。
              </p>`
  }
]
