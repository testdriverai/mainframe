import { useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "~/lib/api_client";
import { cn } from "../lib/utils";

type ProjectInfoProps = {
  id: string;
  name: string;
};

export default function ProjectInfo({ id, name }: ProjectInfoProps) {
  const [projectName, setProjectName] = useState(name);
  const qc = useQueryClient();

  const updateProjectName = useMutation({
    mutationFn: async (newName: string) => {
      const response = await apiClient.connect.apps[":app_id"].$put({
        param: { app_id: id },
        json: { name: newName },
      });
      return response.json();
    },
    onSuccess: () => {
      qc.invalidateQueries(["projects", id]);
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleNameBlur = () => {
    // Submit form
    formRef.current?.requestSubmit();
  };

  const handleSubmit = () => {
    if (projectName !== name) {
      updateProjectName.mutate(projectName);
    }
  };

  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <div className="w-96 p-4 flex flex-col gap-6">
      {/* TODO: Copy button */}
      <form
        ref={formRef}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="space-y-1">
          <Label htmlFor="project-name" className="text-sm">
            Project Name
          </Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            autoComplete="off"
          />
          <p
            className={cn(
              "font-normal text-muted-foreground text-xs transition-opacity duration-75",
              projectName === name ? "opacity-0" : "opacity-100",
            )}
          >
            Unsaved changes.{" "}
            <button className="text-foreground">Save now</button>
          </p>
        </div>
      </form>

      <div className="space-y-1">
        <div className="flex justify-between items-center gap-1 text-sm">
          <Label htmlFor="project-id" className="text-sm">
            Project ID
          </Label>
          <Tooltip delayDuration={0}>
            <TooltipTrigger>
              <Badge
                variant="outline"
                size="xs"
                className="text-muted-foreground leading-normal"
              >
                public
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs" side="bottom" sideOffset={12}>
              This ID doesn't give access to any private data. Apps will soon be
              limited to specific domains to prevent app impersonation. Please
              reach out if you have any questions or suggestions.
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="project-id"
          className="text-muted-foreground bg-primary-foreground"
          value={id}
          readOnly
        />
        <p className="font-normal text-muted-foreground text-xs">
          This is your app ID in your MainframeProvider
        </p>
      </div>
      {/* <h2 className="text-lg font-semibold">Integrations</h2> */}
    </div>
  );
}