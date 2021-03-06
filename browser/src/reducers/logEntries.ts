import { handleActions } from 'redux-actions';
import * as Actions from '../constants/actions';
import { LogEntry } from '../definitions';
import { LogEntriesResponse } from '../types';
import { LogEntriesState } from './';

const initialState: LogEntriesState = { count: 0, isLoading: false, isLoadingCommit: undefined, items: [], pageIndex: 0 };

function fixDates(logEntry: LogEntry) {
    if (logEntry.author && typeof logEntry.author.date === 'string') {
        logEntry.author.date = new Date(logEntry.author.date);
    }
    if (logEntry.committer && typeof logEntry.committer.date === 'string') {
        logEntry.committer.date = new Date(logEntry.committer.date);
    }
}

// tslint:disable-next-line:no-any
export default handleActions<LogEntriesState, any>({
    [Actions.FETCHED_COMMITS]: (state, action: ReduxActions.Action<LogEntriesResponse>) => {
        action.payload!.items.forEach(x => {
            fixDates(x);
        })

        return {
            ...state,
            ...action.payload!,
            selected: undefined,
            isLoading: false,
            isLoadingCommit: undefined
        };
    },

    [Actions.UPDATE_COMMIT_IN_LIST]:  (state, action: ReduxActions.Action<LogEntry>) => {
        const index = state.items.findIndex(item => item.hash.full === action.payload.hash.full);

        if (index >= 0) {
            const logEntry = JSON.parse(JSON.stringify(action.payload));
            fixDates(logEntry);
            state.items.splice(index, 1, logEntry);
        }
        return {
            ...state,
            isLoadingCommit: undefined
        };
    },
    [Actions.FETCHED_COMMIT]: (state, action: ReduxActions.Action<LogEntry>) => {
        fixDates(action.payload);

        return {
            ...state,
            isLoadingCommit: undefined,
            selected: action.payload
        };
    },

    [Actions.IS_FETCHING_COMMIT]: (state, action: ReduxActions.Action<string>) => {
        return { ...state, isLoadingCommit: action.payload } as LogEntriesState;
    },
    // tslint:disable-next-line:no-any
    [Actions.CLEAR_SELECTED_COMMIT]: (state, action: any) => {
        return { ...state, selected: undefined } as LogEntriesState;
    },

    [Actions.IS_LOADING_COMMITS]: (state, action) => {
        return { ...state, isLoading: true } as LogEntriesState;
    }
}, initialState);
