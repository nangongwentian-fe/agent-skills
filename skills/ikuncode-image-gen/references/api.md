# IKunCode 生图参考

## 接口

- 基础地址：`https://api.ikuncode.cc`
- 路径格式：`/v1beta/models/{model}:generateContent`
- 鉴权：`Authorization: Bearer ${IKUNCODE_API_KEY}`

## 常用模型

- `gemini-3.1-flash-image-preview`
  - 默认模型，适合快速出图和反复试词
- `gemini-3-pro-image-preview`
  - 适合终稿和更高质量场景

## 请求结构

文生图：

```json
{
  "contents": [
    {
      "parts": [
        { "text": "一只可爱的皮卡丘正在吃蛋糕" }
      ]
    }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE"],
    "imageConfig": {
      "aspectRatio": "1:1",
      "image_size": "2K"
    }
  }
}
```

图生图：

```json
{
  "contents": [
    {
      "parts": [
        {
          "inlineData": {
            "mimeType": "image/png",
            "data": "base64..."
          }
        },
        { "text": "把背景改成星空，保留主体" }
      ]
    }
  ],
  "generationConfig": {
    "responseModalities": ["IMAGE"],
    "imageConfig": {
      "aspectRatio": "16:9",
      "image_size": "2K"
    }
  }
}
```

## 常用参数

- `aspectRatio`
  - `1:1`
  - `16:9`
  - `9:16`
  - `4:3`
  - `3:4`
  - `3:2`
  - `2:3`
  - `21:9`
  - `5:4`
  - `4:5`
- `image_size`
  - `1K`
  - `2K`
  - `4K`

## 返回取图

从响应里读取首个带图像数据的 part：

```json
candidates[0].content.parts[*].inlineData.data
```

这是 Base64，解码后写成 PNG。

## 实用建议

- 默认用 `flash + 2K`
- 构图探索先用 `1K` 或 `2K`
- 终稿再考虑 `pro` 或 `4K`
- 提示词尽量写清主体、场景、风格、光线、构图和限制条件
