import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "./components/ui/input";
import { useState } from "react";
import axios from "axios";

const UPLOAD_BACKEND_URL = "http://localhost:3000";


export function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Deploy your github repository</CardTitle>
          <CardDescription>Enter the url of your github repository to deploy it</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">Github Repository URL</Label>
              <Input
              onChange={(e) => {
                setRepoUrl(e.target.value);
              }}
              placeholder="https://github.com/username/repo"
              />
            </div>
            <Button onClick={async () => {
              setUploading(true);
              const res = await axios.post(`${UPLOAD_BACKEND_URL}/deploy`, {
                repoUrl: repoUrl
              });
              setUploadId(res.data.id);
              setUploading(false);
              const interval = setInterval(async () => {
                const response = await axios.get(`${UPLOAD_BACKEND_URL}/status?id=${res.data.id}`);

                if (response.data.status === "deployed"){
                  clearInterval(interval);
                  setDeployed(true);
                }
              }, 3000);
            }}
            disabled={uploadId !== "" || uploading} 
            className="w-full"
            type="submit"
            >
           {uploadId? `Deploying(${uploadId})` : uploading? "Uploading...": "Upload"}
            </Button>
          </div>
        </CardContent>
      </Card>
      {deployed && <Card className="w-full max-w-md mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Deployment Status</CardTitle>
          <CardDescription>Your webiste is successfully Deployed!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="deployed-url">Deployed URL</Label>
            <Input id="deployed-url" readOnly type="url" value={`http://${uploadId}.vercel.app/index.html`} />
          </div>
          <br />
          <Button className="w-full" variant="outline">
            <a href={`http://${uploadId}.vercel.app/index.html`} target="_blank">
            Visit Website
            </a>
          </Button>
        </CardContent>
      </Card>
      }

    </main>
  )
}

