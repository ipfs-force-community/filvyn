import * as fs from 'fs';
import * as crypto from 'crypto';
import axios from 'axios';

/**
 * 上传文件到PDP服务
 * 实现基于PDP API规范的两步上传过程
 */
async function uploadPiece(filePath: string, apiBaseUrl: string, jwtToken: string, notifyUrl?: string) {
  console.log(`开始上传文件: ${filePath}`);
  
  // 1. 读取文件并计算SHA-256哈希值
  const fileData = fs.readFileSync(filePath);
  const fileSize = fileData.length;
  const fileHash = crypto.createHash('sha256').update(fileData).digest('hex');
  
  console.log(`文件大小: ${fileSize} 字节`);
  console.log(`SHA-256 哈希值: ${fileHash}`);
  
  // 2. 发起上传请求
  try {
    console.log('步骤1: 发起上传请求...');
    
    const initiateResponse = await axios({
      method: 'post',
      url: `${apiBaseUrl}/pdp/piece`,
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        check: {
          name: 'sha2-256',
          hash: fileHash,
          size: fileSize
        },
        notify: notifyUrl
      }
    });
    
    // 3. 处理响应
    // 如果文件已存在 (200 OK)
    if (initiateResponse.status === 200) {
      const { pieceCID } = initiateResponse.data;
      console.log(`文件已存在，无需上传。Piece CID: ${pieceCID}`);
      return pieceCID;
    }
    
    // 如果需要上传 (201 Created)
    if (initiateResponse.status === 201) {
      console.log('步骤2: 上传文件数据...');
      // 从Location头中获取上传URL
      const uploadUrl = initiateResponse.headers.location;
      if (!uploadUrl) {
        throw new Error('服务器未返回上传URL');
      }
      
      // 执行第二步 - 上传文件数据
      const uploadResponse = await axios({
        method: 'put',
        url: `${apiBaseUrl}${uploadUrl}`,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': fileSize.toString()
        },
        data: fileData
      });
      
      // 检查上传结果
      if (uploadResponse.status === 204) {
        console.log('文件上传成功');
        // 通常在实际应用中，我们可能需要额外调用API来获取最终的piece CID
        return '上传成功，但需要额外步骤获取Piece CID';
      } else {
        throw new Error(`意外的上传响应状态: ${uploadResponse.status}`);
      }
    }
    
    throw new Error(`意外的初始响应状态: ${initiateResponse.status}`);
    
  } catch (error) {
    console.error('上传过程中发生错误:', error);
    throw error;
  }
}

// 命令行参数处理
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.log('用法: node upload-piece.js <文件路径> <API基础URL> <JWT令牌> [通知URL]');
    process.exit(1);
  }
  
  const [filePath, apiBaseUrl, jwtToken, notifyUrl] = args;
  
  try {
    const result = await uploadPiece(filePath, apiBaseUrl, jwtToken, notifyUrl);
    console.log('处理结果:', result);
  } catch (error) {
    console.error('执行失败:', error);
    process.exit(1);
  }
}

// 执行主函数
main();
