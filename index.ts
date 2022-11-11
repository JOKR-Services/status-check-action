import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from "@octokit/action";

const octokit = new Octokit();
interface ListJobsConfig {
    [key: string]: string | number;
    owner: string;
    repo: string;
    run_id: number;
}

async function listJobs(config: ListJobsConfig): Promise<any[]> {
    try {
        const jobList = await octokit.request('GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs', config);
        return jobList.data.jobs;
    } catch (error: any) {
        core.error('⚠️ Error getting job list ');
        core.error(error);
        return [];
    }
}

async function main() {
    const debug = process.env.DEBUG ?? false;
    const { runId, runNumber } = github.context;
    const repoFullName = github.context.payload.repository?.full_name?.split('/');
    if(repoFullName == undefined) return core.setFailed('Repository name could not be determined');

    const config: ListJobsConfig = {
        owner: repoFullName[0],
        repo: repoFullName[1],
        run_id: runId,
        attempt_number: runNumber
    }
    
    const jobList = await listJobs(config);
    for (const job of jobList) {
        if (debug) {
            console.log(job);
        }
        if(job.conclusion == 'failure'){
            return core.setFailed(`❌ All jobs need to pass correctly.`);
        }
    }
    core.info("✅ All jobs passed");
}

main();
