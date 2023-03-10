import { id } from 'element-plus/es/locale';
import request from '../utils/request';
import type { TableItem } from "../type/login";
//import { number } from 'echarts';
//import config from '/vue.config.js';

export const fetchData = () => {
    return request({
		method: 'get',
        url: './table.json',
    });
};

export const FindData = () => {
    return request({
		method: 'get',
        url: 'http://10.204.16.53:8020/QCLab/simio/arrival_table/all',
    });
};

export const DelData = (id: number) => {
    return request({
		method: 'delete',
        url: 'http://10.204.16.53:8020/QCLab/simio/arrival_table/delete/' + id,
		params: id
	});
}

export const UpData = (id: number) => {
    return request({
		method: 'put',
        url: 'http://10.204.16.53:8020/QCLab/simio/arrival_table/update' + id,
		params: id
    });
};

//不报错
export const AddData = () => {
    return request({
	method: 'post',
    url: 'http://10.204.16.53:8020/QCLab/simio/arrival_table/add',
    });
};

export const RunData = () => {
    return request({
		method: 'post',
        url: 'http://10.204.16.53:8020/QCLab/simio/run',
    });
};

/* /simio/run/state */

export const ResultData = () => {
    return request({
		method: 'post',
        url: 'http://10.204.16.53:8020/QCLab/simio/run',
    });
};
