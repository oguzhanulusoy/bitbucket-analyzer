package com.orion.bitbucket.helper;

public class DatabaseHelper {
    public static final String PROJECTS      = "projects";
    public final static String DATABASE_NAME = "bitbucket";
    public final static String DATABASE_URL  = "mongodb://localhost:27017";

    public static final String ASRV_PROJECT_KEY = "ASRV";
    public static final String IAC_PROJECT_KEY  = "IAC";
    public static final String UI_PROJECT_KEY   = "NG";

    public static final String ASRV_REPO_MCP_CORE_ROOT = "mcp_core_root";
    public static final String ASRV_REPO_AS_RAF_CORE   = "as_raf_core";
    public static final String IAC_REPO_IAC            = "iac";
    public static final String ASRV_PLATFORM           = "mcp_install";
    public static final String NG_PROV_UI              = "as-prov-ui";
    public static final String NG_PA_UI                = "as-portal-ui";


    // ALL COLLECTIONS ARRAY EXCEPT PROJECTS COLLECTION
    public static final String[] ALL_COLLECTIONS_ARRAY = new String[]{
            ASRV_REPO_MCP_CORE_ROOT,
            ASRV_REPO_AS_RAF_CORE,
            IAC_REPO_IAC,
            ASRV_PLATFORM,
            NG_PROV_UI,
            NG_PA_UI
    };

}
