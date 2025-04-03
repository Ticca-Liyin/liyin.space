import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { SyncStatusCode, StatusType, RequestType } from '@/types/syncStatusCode'

export const useSyncStatusStore = defineStore('syncStatus', () => {
    // 每个账号的状态管理
    const accountStatuses = ref({});

    // 请求计数器
    let requestCounter = 0;

    // 获取新的请求ID
    const getNewRequestId = () => ++requestCounter;

    // 初始化账号状态
    const initExistAccountStatus = (tokenId) => {
        const events = {
            [RequestType.AccountInfo]: { 
                status: SyncStatusCode.SUCCESS, 
                lastRequestId: 0 
            },
            [RequestType.Achievements]: { 
                status: SyncStatusCode.SUCCESS, 
                lastRequestId: 0 
            },
            [RequestType.Textjoins]: { 
                status: SyncStatusCode.SUCCESS, 
                lastRequestId: 0 
            },
            [RequestType.CustomNotAchieved]: { 
                status: SyncStatusCode.SUCCESS, 
                lastRequestId: 0 
            }
        };

        if (!accountStatuses.value[tokenId]) {
            accountStatuses.value[tokenId] = {
                status: StatusType.Exist,
                events: events
            };
            return
        } 

        const accountStatuse = accountStatuses.value[tokenId];
        if (accountStatuse.status === StatusType.NotExist) {
            if (accountStatuse.events[RequestType.AccountDelete]?.status ===  SyncStatusCode.SUCCESS) {
                accountStatuses.value[tokenId] = {
                    status: StatusType.Exist,
                    events: events
                };
                return
            } else {
                for (let type in events) {
                    events[type].status = SyncStatusCode.FAILED
                }
                accountStatuses.value[tokenId] = {
                    status: StatusType.Exist,
                    events: events
                };
                return
            }
        }
    };

    const initNotExistAccountStatus = (tokenId) => {
        if (!accountStatuses.value[tokenId] || accountStatuses.value[tokenId].status === StatusType.Exist) {
            accountStatuses.value[tokenId] = {
                status: StatusType.NotExist,
                events: {
                    [RequestType.AccountDelete]: { 
                        status: SyncStatusCode.SUCCESS, 
                        lastRequestId: 0 
                    }
                }
            };
        }
    };

    // 开始请求
    const startRequest = (exist, tokenId, type) => {
        if (exist) {
            initExistAccountStatus(tokenId);            
        } else {
            initNotExistAccountStatus(tokenId);
        }

        const requestId = getNewRequestId();
        const account = accountStatuses.value[tokenId];
        account.events[type].lastRequestId = requestId;
        account.events[type].status = SyncStatusCode.SYNCING;
        return requestId;
    };

    // 请求成功
    const requestSuccess = (tokenId, type, requestId) => {
        const account = accountStatuses.value[tokenId];
        if (account && account?.events[type]?.lastRequestId === requestId) {
            account.events[type].status = SyncStatusCode.SUCCESS;
        }
    };

    // 请求失败
    const requestFailed = (tokenId, type, requestId) => {
        const account = accountStatuses.value[tokenId];
        if (account && account?.events[type]?.lastRequestId === requestId) {
        account.events[type].status = SyncStatusCode.FAILED;
        }
    };

    const currentAccountStatuse = ref({
        status: SyncStatusCode.SUCCESS, 
        lastRequestId: 0 
    })

    const startCurrentAccountRequest = () => {
        const requestId = getNewRequestId();
        currentAccountStatuse.value.lastRequestId = requestId;
        currentAccountStatuse.value.status = SyncStatusCode.SYNCING;
        return requestId;
    };

    const requestCurrentAccountSuccess = (requestId) => {
        if (currentAccountStatuse.value.lastRequestId === requestId) {
            currentAccountStatuse.value.status = SyncStatusCode.SUCCESS;
        }
    };

    const requestCurrentAccountFailed = (requestId) => {
        if (currentAccountStatuse.value.lastRequestId === requestId) {
            currentAccountStatuse.value.status = SyncStatusCode.FAILED;
        }
    };

    const resetStatus = () => {
        accountStatuses.value = {};
        currentAccountStatuse.value = {
            status: SyncStatusCode.SUCCESS, 
            lastRequestId: 0 
        }
    }

    const setAllTokenIdsStatusFailed = (tokenIds) => {
        accountStatuses.value = {};
        currentAccountStatuse.value = {
            status: SyncStatusCode.FAILED, 
            lastRequestId: 0 
        }
        
        tokenIds.forEach((tokenId) => {
            accountStatuses.value[tokenId] = {
                status: StatusType.Exist,
                events: {
                    [RequestType.AccountInfo]: { 
                        status: SyncStatusCode.FAILED, 
                        lastRequestId: 0 
                    },
                    [RequestType.Achievements]: { 
                        status: SyncStatusCode.FAILED, 
                        lastRequestId: 0 
                    },
                    [RequestType.Textjoins]: { 
                        status: SyncStatusCode.FAILED, 
                        lastRequestId: 0 
                    },
                    [RequestType.CustomNotAchieved]: { 
                        status: SyncStatusCode.FAILED, 
                        lastRequestId: 0 
                    }
                }
            };
        })
    }

    // 计算账号总体状态
    const syncStatus = computed(() => {
        const allStatuses = Object.values(accountStatuses.value).map(account => {
            const requestStatuses = Object.values(account.events).map(event => event.status);
            
            if (requestStatuses.includes(SyncStatusCode.SYNCING)) {
                return SyncStatusCode.SYNCING;
            }
            if (requestStatuses.includes(SyncStatusCode.FAILED)) {
                return SyncStatusCode.FAILED;
            }
            return SyncStatusCode.SUCCESS;
        });
        
        if (allStatuses.includes(SyncStatusCode.SYNCING) || 
            currentAccountStatuse.value.status === SyncStatusCode.SYNCING) {
            return SyncStatusCode.SYNCING;
        } else if (allStatuses.includes(SyncStatusCode.FAILED) ||
            currentAccountStatuse.value.status === SyncStatusCode.FAILED) {
            return SyncStatusCode.FAILED;
        } else {
            return SyncStatusCode.SUCCESS;
        }
    });

    return {
        accountStatuses,
        currentAccountStatuse,
        startRequest,
        requestSuccess,
        requestFailed,
        startCurrentAccountRequest,
        requestCurrentAccountSuccess,
        requestCurrentAccountFailed,
        resetStatus,
        setAllTokenIdsStatusFailed,
        syncStatus
    }
});