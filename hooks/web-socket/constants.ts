export enum Application {
    REFINERY = 'REFINERY',
    COGNITION = 'COGNITION',
    GATES = 'GATES',
    WELCOME_SCREEN = 'WELCOME_SCREEN',
}

export enum CurrentPage {
    PROJECTS = 'PROJECTS',
    LOOKUP_LISTS_OVERVIEW = 'LOOKUP_LISTS_OVERVIEW',
    NEW_PROJECT = 'NEW_PROJECT',
    PROJECT_OVERVIEW = 'PROJECT_OVERVIEW',
    DATA_BROWSER = 'DATA_BROWSER',
    LABELING = 'LABELING',
    HEURISTICS = 'HEURISTICS',
    ADMIN_PAGE = 'ADMIN_PAGE',
    USERS = 'USERS',
    UPLOAD_RECORDS = 'UPLOAD_RECORDS',
    PROJECT_SETTINGS = "PROJECT_SETTINGS",
    MODELS_DOWNLOAD = "MODELS_DOWNLOAD",
    ATTRIBUTE_CALCULATION = "ATTRIBUTE_CALCULATION",
    LOOKUP_LISTS_DETAILS = "LOOKUP_LISTS_DETAILS",
    MODEL_CALLBACKS = "MODEL_CALLBACKS",
    LABELING_FUNCTION = "LABELING_FUNCTION",
    ACTIVE_LEARNING = "ACTIVE_LEARNING",
    ZERO_SHOT = "ZERO_SHOT",
    CROWD_LABELER = "CROWD_LABELER",
    RECORD_IDE = "RECORD_IDE",
    EDIT_RECORDS = "EDIT_RECORDS",
    NOTIFICATION_CENTER = "NOTIFICATION_CENTER",
    EXPORT = "EXPORT",
    COMMENTS = "COMMENTS",
    BRICKS_INTEGRATOR = "BRICKS_INTEGRATOR",
    CONFIG = "CONFIG",
    COGNITION_LAYOUT = "COGNITION_LAYOUT",
    GATES_LAYOUT = "GATES_LAYOUT",
    WELCOME_SCREEN_LAYOUT = "WELCOME_SCREEN_LAYOUT",
}

export enum CurrentPageSubKey {
    EMBEDDINGS = 'EMBEDDING',
    NONE = 'NONE',
    BUTTONS_CONTAINER = 'BUTTONS_CONTAINER',
    VARIABLE_SELECTION = 'VARIABLE_SELECTION',
    SNAPSHOT_EXPORT = 'SNAPSHOT_EXPORT',
    GLOBAL = 'GLOBAL',
    FILE_UPLOAD = 'FILE_UPLOAD',
}

export const WHITELIST_LOOKUP_REFINERY = {
    [CurrentPage.PROJECTS]: {
        [CurrentPageSubKey.NONE]: ['project_created', 'project_deleted', 'project_update', 'file_upload'],
        [CurrentPageSubKey.BUTTONS_CONTAINER]: ['bad_password'],
        [CurrentPageSubKey.FILE_UPLOAD]: ['file_upload']
    },
    [CurrentPage.UPLOAD_RECORDS]: {
        [CurrentPageSubKey.NONE]: ['file_upload']
    },
    [CurrentPage.MODELS_DOWNLOAD]: {
        [CurrentPageSubKey.NONE]: ['model_provider_download']
    },
    [CurrentPage.COMMENTS]: {
        [CurrentPageSubKey.NONE]: ['label_created', 'label_deleted', 'attributes_updated', 'calculate_attribute', 'embedding_deleted', 'embedding', 'labeling_task_updated', 'labeling_task_deleted', 'labeling_task_created', 'data_slice_created', 'data_slice_updated', 'data_slice_deleted', 'information_source_created', 'information_source_updated', 'information_source_deleted', 'knowledge_base_created', 'knowledge_base_updated', 'knowledge_base_deleted'],
        [CurrentPageSubKey.GLOBAL]: ['comment_created', 'comment_updated', 'comment_deleted', 'project_created', 'project_deleted']
    },
    [CurrentPage.BRICKS_INTEGRATOR]: {
        [CurrentPageSubKey.VARIABLE_SELECTION]: ['attributes_updated', 'calculate_attribute', 'label_created', 'label_deleted', 'labeling_task_deleted', 'labeling_task_updated', 'labeling_task_created', 'embedding', 'embedding_deleted', 'knowledge_base_deleted', 'knowledge_base_created']
    },
    [CurrentPage.PROJECT_OVERVIEW]: {
        [CurrentPageSubKey.NONE]: ['label_created', 'label_deleted', 'labeling_task_deleted', 'labeling_task_updated', 'labeling_task_created', 'weak_supervision_finished', 'data_slice_created', 'data_slice_updated', 'data_slice_deleted']
    },
    [CurrentPage.PROJECT_SETTINGS]: {
        [CurrentPageSubKey.NONE]: ['project_update', 'tokenization', 'calculate_attribute', 'embedding', 'attributes_updated', 'gates_integration', 'information_source_deleted', 'information_source_updated', 'embedding_deleted', 'embedding_updated', 'upload_embedding_payload', 'label_created', 'label_deleted', 'labeling_task_deleted', 'labeling_task_updated', 'labeling_task_created'],
        [CurrentPageSubKey.SNAPSHOT_EXPORT]: ['project_updated', 'project_export'],
        [CurrentPageSubKey.EMBEDDINGS]: ['embedding_updated', 'upload_embedding_payload']

    },
    [CurrentPage.EXPORT]: {
        [CurrentPageSubKey.NONE]: ['record_export', 'calculate_attribute', 'labeling_task_deleted', 'labeling_task_created', 'data_slice_created', 'data_slice_deleted', 'information_source_created', 'information_source_deleted']
    },
    [CurrentPage.MODEL_CALLBACKS]: {
        [CurrentPageSubKey.NONE]: ['information_source_created', 'information_source_updated', 'information_source_deleted', 'labeling_task_deleted', 'labeling_task_updated', 'labeling_task_created', 'model_callback_update_statistics']
    },
    [CurrentPage.LOOKUP_LISTS_DETAILS]: {
        [CurrentPageSubKey.NONE]: ['knowledge_base_updated', 'knowledge_base_deleted', 'knowledge_base_term_updated']
    },
    [CurrentPage.LOOKUP_LISTS_OVERVIEW]: {
        [CurrentPageSubKey.NONE]: ['knowledge_base_updated', 'knowledge_base_deleted', 'knowledge_base_created']
    },
    [CurrentPage.LABELING]: {
        [CurrentPageSubKey.NONE]: ['attributes_updated', 'calculate_attribute', 'payload_finished', 'weak_supervision_finished', 'record_deleted', 'rla_created', 'rla_deleted', 'access_link_changed', 'access_link_removed', 'label_created', 'label_deleted', 'labeling_task_deleted', 'labeling_task_updated', 'labeling_task_created'],

    },
    [CurrentPage.ZERO_SHOT]: {
        [CurrentPageSubKey.NONE]: ['labeling_task_updated', 'labeling_task_created', 'label_created', 'label_deleted', 'labeling_task_deleted', 'information_source_deleted', 'information_source_updated', 'payload_update_statistics', 'payload_finished', 'payload_failed', 'payload_created', 'zero-shot', 'zero_shot_download']
    },
    [CurrentPage.LABELING_FUNCTION]: {
        [CurrentPageSubKey.NONE]: ['labeling_task_updated', 'labeling_task_created', 'label_created', 'label_deleted', 'labeling_task_deleted', 'information_source_deleted', 'information_source_updated', 'model_callback_update_statistics', 'payload_progress', 'payload_finished', 'payload_failed', 'payload_created', 'payload_update_statistics'],
    },
    [CurrentPage.CROWD_LABELER]: {
        [CurrentPageSubKey.NONE]: ['labeling_task_updated', 'labeling_task_created', 'label_created', 'label_deleted', 'labeling_task_deleted', 'information_source_deleted', 'information_source_updated', 'model_callback_update_statistics']
    },
    [CurrentPage.ACTIVE_LEARNING]: {
        [CurrentPageSubKey.NONE]: ['labeling_task_updated', 'labeling_task_created', 'label_created', 'label_deleted', 'labeling_task_deleted', 'information_source_deleted', 'information_source_updated', 'model_callback_update_statistics', 'embedding_deleted', 'embedding', 'payload_finished', 'payload_failed', 'payload_created', 'payload_update_statistics']
    },
    [CurrentPage.HEURISTICS]: {
        [CurrentPageSubKey.NONE]: ['labeling_task_updated', 'labeling_task_created', 'labeling_task_deleted', 'information_source_created', 'information_source_updated', 'information_source_deleted', 'payload_finished', 'payload_failed', 'payload_created', 'payload_update_statistics', 'embedding_deleted'],

    },
    [CurrentPage.EDIT_RECORDS]: {
        [CurrentPageSubKey.NONE]: ['calculate_attribute']
    },
    [CurrentPage.DATA_BROWSER]: {
        [CurrentPageSubKey.NONE]: ['data_slice_created', 'data_slice_updated', 'data_slice_deleted', 'label_created', 'label_deleted', 'labeling_task_deleted', 'labeling_task_updated', 'labeling_task_created', 'information_source_created', 'information_source_updated', 'information_source_deleted', 'attributes_updated', 'calculate_attribute', 'embedding', 'embedding_deleted'],

    },
    [CurrentPage.ATTRIBUTE_CALCULATION]: {
        [CurrentPageSubKey.NONE]: ['attributes_updated', 'calculate_attribute', 'tokenization', 'knowledge_base_updated', 'knowledge_base_deleted', 'knowledge_base_created'],

    },
    [CurrentPage.ADMIN_PAGE]: {
        [CurrentPageSubKey.NONE]: ['pat']
    },
    [CurrentPage.NOTIFICATION_CENTER]: {
        [CurrentPageSubKey.NONE]: ['notification_created', 'project_deleted', 'config_updated', 'admin_message'],

    }
}

export const WHITELIST_LOOKUP_COGNITION = {
    [CurrentPage.COGNITION_LAYOUT]: {
        [CurrentPageSubKey.NONE]: ['admin_message']
    }
}

export const WHITELIST_LOOKUP_GATES = {
    [CurrentPage.GATES_LAYOUT]: {
        [CurrentPageSubKey.NONE]: ['admin_message']
    }
}

export const WHITE_LIST_LOOKUP_WELCOME_SCREEN = {
    [CurrentPage.WELCOME_SCREEN_LAYOUT]: {
        [CurrentPageSubKey.NONE]: ['admin_message']
    }
}
