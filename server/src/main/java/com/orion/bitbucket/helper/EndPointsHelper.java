package com.orion.bitbucket.helper;

import org.springframework.security.core.parameters.P;

public final class EndPointsHelper {
    /*
     * Bitbucket REST API end points and tokens. In order to get the GIT statistics
     * from Bitbucket we used "bitbucket-read-only-user" bearer token. In case of a
     * token change please modify TOKEN attribute.
     */
    private EndPointsHelper() {
    }

    // BASE URL FOR ALL PROJECTS
    public static final String BASE_URL = "http://bitbucket.rbbn.com/rest/api/1.0/projects/"; // TODO: Before running the application, modify this url

    public static final String ASRV_MCP_CORE_ROOT_URL = endPointStrBuilder(DatabaseHelper.ASRV_PROJECT_KEY, DatabaseHelper.ASRV_REPO_MCP_CORE_ROOT);
    public static final String ASRV_AS_RAF_CORE_URL   = endPointStrBuilder(DatabaseHelper.ASRV_PROJECT_KEY, DatabaseHelper.ASRV_REPO_AS_RAF_CORE);
    public static final String IAC_IAC_URL            = endPointStrBuilder(DatabaseHelper.IAC_PROJECT_KEY, DatabaseHelper.IAC_REPO_IAC);
    public static final String ASRV_PLATFORM_URL      = endPointStrBuilder(DatabaseHelper.ASRV_PROJECT_KEY, DatabaseHelper.ASRV_PLATFORM);
    public static final String NG_PROV_UI_URL         = endPointStrBuilder(DatabaseHelper.UI_PROJECT_KEY, DatabaseHelper.NG_PROV_UI);
    public static final String NG_PA_UI_URL           = endPointStrBuilder(DatabaseHelper.UI_PROJECT_KEY, DatabaseHelper.NG_PA_UI);

    public static String endPointStrBuilder(String projectKey, String repoName){
        return BASE_URL + projectKey + "/repos/" + repoName + "/pull-requests?state=ALL&limit=100&start=";
    }

    public static final class Bearer {
        private Bearer() {
        }

        public static final String TOKEN = "MjU3ODA1MTE0MjE1Ot03St9b61SlEF4kPI120UbbR5Ja"; // TODO: Before running the application, get a token from Bitbucket
    }

}




