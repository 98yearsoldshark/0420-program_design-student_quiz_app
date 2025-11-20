我的系统既能显示图片类型存储的题目，也能显示latex存储的题目，接下来尝试显示latex题目的同时，显示图片题目，他们是并列关系。注意如果用户选择“全部”，获取逻辑是，首先通过folder路由获取总体学科分类，然后分别通过folder获取学科下年级分类，再分别获取年份分类，再分别获取题目类型分类，再分别获取题目，最终通过题目和/image路由获取图片链接。这是举例查看图片链接“http://localhost:3001/prtsc/电磁场/大一/2019/A卷/20250418T200144/A.png”。这是swagger文档的页面数据获取prtsc目录下的文件夹结构，支持按科目、年级、年份和类型筛选

Parameters
Cancel
Name	Description
subject
string
(query)
科目

grade
string
(query)
年级

year
string
(query)
年份

type
string
(query)
题目类型

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'http://localhost:3001/folders?subject=%E7%94%B5%E7%A3%81%E5%9C%BA&grade=%E5%A4%A7%E4%B8%80&year=2019&type=A%E5%8D%B7' \
  -H 'accept: application/json'
Request URL
http://localhost:3001/folders?subject=%E7%94%B5%E7%A3%81%E5%9C%BA&grade=%E5%A4%A7%E4%B8%80&year=2019&type=A%E5%8D%B7
Server response
Code	Details
200	
Response body
Download
[
  {
    "name": "20250418T153631",
    "type": "folder"
  },
  {
    "name": "20250418T200144",
    "type": "folder"
  },
  {
    "name": "20250418T200446",
    "type": "folder"
  },
  {
    "name": "20250419T220611",
    "type": "folder"
  }
]
获取指定文件夹中的图片列表

Parameters
Cancel
Name	Description
folderPath *
string
(query)
文件夹路径

Execute
Clear
Responses
Curl

curl -X 'GET' \
  'http://localhost:3001/images?folderPath=%E7%94%B5%E7%A3%81%E5%9C%BA%2F%E5%A4%A7%E4%B8%80%2F2019%2FA%E5%8D%B7%2F20250418T200144' \
  -H 'accept: application/json'
Request URL
http://localhost:3001/images?folderPath=%E7%94%B5%E7%A3%81%E5%9C%BA%2F%E5%A4%A7%E4%B8%80%2F2019%2FA%E5%8D%B7%2F20250418T200144
Server response
Code	Details
200	
Response body
Download
[
  {
    "name": "A.png",
    "url": "/prtsc/电磁场/大一/2019/A卷/20250418T200144/A.png"
  }
]