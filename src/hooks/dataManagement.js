import { uploadData, downloadData, getUrl } from "aws-amplify/storage";

async function upload_file(file_id, file) {
    // file_id can come with or without .csv suffix (doesn't matter)
    // TODO: Verify that file uploaded is a CSV
    console.debug("Starting upload of file", file_id);

    try {
        const uploadTask = uploadData({
            key: `userdata/${file_id}`, // key NEEDS to be in this format - userId folder then fileId file
            data: file,
            options: {
                accessLevel: "private", // authorized users only!
                // onProgress, // Optional progress callback.
            },
        });
        uploadTask.result.then(
            (value) => console.info("Upload success", value),
            (reason) => console.error("Error uploading file", reason)
        );
    } catch (error) {
        console.error("Error uploading file", error);
    }
}

async function get_result(job_id) {
    // Retrieves contents of results
    // This function assumes that the job is 'COMPLETED'
    console.debug("Retrieving results of job", job_id);

    try {
        // Downloads file content to memory
        // The file name is always ${job_id}.json
        const { body } = await downloadData({
            key: `results/${job_id}.json`,
            options: {
                accessLevel: "private", // access level of the file being downloaded
                // TODO: (low) Download progress?
                // onProgress: (event) => {
                //     console.log(event.transferredBytes);
                // }, // optional progress callback
            },
        }).result;

        const result_json = await body.text();
        console.info("Download success", result_json);
        return result_json;
    } catch (error) {
        console.error("Error downloading file", error);
    }
}

async function get_result_url(job_id) {
    // Retrieves download URL of results as a string
    // This function assumes that the job is 'COMPLETED'
    console.debug("Retrieving results of job", job_id);

    try {
        const url_result = await getUrl({
            key: `results/${job_id}.json`,
            options: {
                accessLevel: "private", // access level of the file being downloaded
                expiresIn: 60, // 60 seconds for now
            },
        });

        console.info("Download URL retrieved", url_result.url.href);
        console.info("Expires at", url_result.expiresAt);
        return url_result.url.href;
    } catch (error) {
        console.error("Error downloading file", error);
    }
}

export { upload_file, get_result, get_result_url };
