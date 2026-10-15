## 公牛可信供应链 操作APP

### 已接入OTA

### 应用升级步骤
1、以 150 版本为例：

1. 更新 /manifest.json => versionCode
2. 更新 /ota/version.json =>versionCode
3. 将 version.json 同步至 科院ALIOSS/gongniu-projects/trust_supply_chain_app/下
4. 云带包代码，并将代码命名为 app_150.apk
5. 将 app_150.apk 同步至 科院ALIOSS/gongniu-projects/trust_supply_chain_app/下
6. 重新打开应用，即可 OTA

2、应用升级务必需要更新 云端的: 
- version.json 
- 以及 app_xxx.apk  // xxx 为版本号

##### version.json结构如下：
```
{
	"versionCode": 100,
	"description": "初版发布",
	"createDate": "2022-08-22"
}
```