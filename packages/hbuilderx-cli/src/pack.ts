import type { CliOptions } from './types';
import fs from 'node:fs';
import path from 'node:path';
import { readJson } from '@tomjs/node';
import archiver from 'archiver';
import colors from 'picocolors';
import { logger } from './util';

export async function packExtension(opts: CliOptions) {
  const packFiles = Array.isArray(opts.packFiles) ? opts.packFiles : ['dist', 'package.json', 'license'];
  if (!packFiles.includes('package.json')) {
    packFiles.push('package.json');
  }

  const cwd = opts.cwd || process.cwd();
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    logger.error(`未找到 ${colors.green(pkgPath)}`);
    return;
  }
  const pkg = await readJson(pkgPath);
  if (!checkPackage(pkg)) {
    return;
  }
  const mainFile = path.join(cwd, pkg.main);
  if (!fs.existsSync(mainFile)) {
    logger.error(`未找到 ${colors.bold('package.json')} 中 ${colors.bold('main')} 字段值路径： ${colors.green(mainFile)}`);
    return;
  }
  logger.info(`${colors.blue(pkg.name)} 插件打包开始`);
  const archive = archiver('zip', {
    zlib: { level: 9 },
  });
  archive.on('error', (err) => {
    logger.error(err);
  });
  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      logger.warn(err);
    }
    else {
      throw err;
    }
  });

  archive.on('close', () => {
    const size = `${(archive.pointer() / 1024).toFixed(2)} K`;
    logger.info(`${colors.blue(pkg.name)} 插件打包完成，总共 ${colors.green(size)}`);
  });

  const output = fs.createWriteStream(path.join(cwd, `${pkg.name}.zip`));
  archive.pipe(output);

  packFiles.forEach((file) => {
    const filePath = path.join(cwd, file);
    if (!fs.existsSync(filePath)) {
      return;
    }
    if (fs.lstatSync(filePath).isDirectory()) {
      archive.directory(filePath, file);
    }
    else {
      archive.file(filePath, { name: file });
    }
  });

  archive.finalize();
}

function checkPackage(pkg: any) {
  if (!pkg) {
    logger.error('package.json 文件格式错误');
    return false;
  }

  const fields: string[] = ['name', 'version', 'publisher', 'displayName', 'main'];
  const errorFields: string[] = [];

  fields.forEach((field) => {
    if (!pkg[field]) {
      errorFields.push(field);
    }
  });
  if (errorFields.length) {
    logger.error(`package.json 缺少 ${errorFields.join(', ')} 属性`);
    return false;
  }

  return true;
}
