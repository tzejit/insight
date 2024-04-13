import { generateClient } from "aws-amplify/api";
import { createJob } from "../graphql/mutations";
import { getJob, listJobs } from "../graphql/queries";

async function submit_job(userId, awsId, fileId, jobName) {
    if (!userId || !awsId || !fileId) {
        console.error(
            "Cannot submit job without userId, awsId, or fileId!",
            userId,
            fileId
        );
        return;
    }
    const client = generateClient();
    const newJob = {
        // for graphql in general, refer to src/graphql/schema.graphql for more details
        file_id: fileId,
        aws_id: awsId,
        user_id: userId,

        // job_status is actually an enum field, but we just use string so long as it matches enum name
        job_status: "WAITING",

        // TODO: (high priority) add input fields for everything below here:
        job_name: jobName,
        job_config: {
            prompt_id: "", // use default prompt
            product_name: "Amazon Kindle",
            review_title_col: "reviews.title",
            review_text_col: "reviews.text",
            review_rating_col: "reviews.rating",
        },
    };

    console.info("Submitting new job", fileId);
    try {
        const graphql_res = await client.graphql({
            query: createJob,
            variables: {
                input: newJob,
            },
        });
        const new_job_id = graphql_res.data.createJob.id;
        console.info("Successfully submitted new job with id:", new_job_id);

        return new_job_id;
    } catch (error) {
        console.error("Error submitting new job", error);
        console.error("Job details", newJob);
        throw error; // trigger rejection in promise
    }
}

async function start_job_polling(
    jobId,
    delay_in_seconds,
    job_progress_callback
) {
    console.info("Polling job status for", jobId);
    const sleep = (seconds) =>
        new Promise((resolve) => setTimeout(resolve, seconds * 1000));

    let new_job_status = (await get_job(jobId)).job_status;
    let old_job_status = new_job_status;
    while (new_job_status !== "COMPLETED" && new_job_status !== "FAILED") {
        await sleep(delay_in_seconds); // polling with 5 second gap
        new_job_status = (await get_job(jobId)).job_status;
        console.log("Poll result:", new_job_status);
        if (new_job_status !== old_job_status) {
            job_progress_callback(new_job_status);
            old_job_status = new_job_status;
        }
    }
    console.debug("Polling completed for", jobId);
}

async function get_job(jobId) {
    const client = generateClient();
    try {
        const result = await client.graphql({
            query: getJob,
            variables: { id: jobId },
        });
        console.info("Successfully retrieved job with id", jobId);
        const this_job = result.data.getJob;
        return this_job; // a Job object (as defined in the graphql file)
    } catch (error) {
        console.error("Error getting job", error);
        return;
    }
}

async function list_jobs(userId) {
    const client = generateClient();
    const filter_params = {
        filter: {
            user_id: {
                eq: userId, // filter only matching user IDs
            },
        },
    };
    try {
        const result = await client.graphql({
            query: listJobs,
            variables: { filter_params },
        });
        console.info("Successfully listed jobs");
        const job_list = result.data.listJobs.items;
        return job_list;
    } catch (error) {
        console.error("Error getting list of jobs", error);
        return;
    }
}

async function get_latest_job(userId) {
    const client = generateClient();
    const filter_params = {
        filter: {
            user_id: {
                eq: userId, // filter only matching user IDs
            },
        },
    };
    try {
        const result = await client.graphql({
            query: listJobs,
            variables: filter_params,
        });
        console.info("Successfully listed jobs");
        const job_list = result.data.listJobs.items;
        return job_list;
    } catch (error) {
        console.error("Error getting list of jobs", error);
        return;
    }
}

export { submit_job, start_job_polling, get_job, list_jobs };
