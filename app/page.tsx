"use client";

import { DataTable } from "@/components/data-table";
import { User, createColumns } from "./columns";
import { ColumnDef } from "@tanstack/react-table";
import Chat from "@/components/chat";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { createUser, deleteUser, editUser, fetchUsers } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import useEscapeKey from "../hooks/useEscapeKey";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/Imageupload";
import Modal from "@/components/Modal";

export default function Home() {
  const { toast } = useToast();
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    fetch("https://665621609f970b3b36c4625e.mockapi.io/users").then(
      async (res) => {
        const response = await res.json();
        setData(response);
      }
    );
  }, []);

  const onDelete = (user: User) => {
    try {
      user.id &&
        deleteUser(user.id).then(async (res) => {
          const updatedData = data.filter((item: User) => item.id != user.id);
          setData([...updatedData]);
          toast({
            title: `User with fullname: ${user.fullName} has been deleted successfully.`,
          });
        });
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  const onEdit = (user: User) => {
    setSelectedRowDetails(user);
    setIsOpen(true);
  };

  const columns: ColumnDef<User>[] = createColumns(onEdit, onDelete);

  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (filterValue) {
      fetchUsers(1, { search: filterValue }).then(async (res) => {
        setData(res);
      });
    } else {
      fetchUsers(1, {}).then(async (res) => {
        setData(res);
      });
    }
  }, [filterValue]);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState("");

  const handleImageUpload = async (file: File) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  const createNewUser = () => {
    try {
      createUser({ username, fullName, avatar }).then(async (res) => {
        fetchUsers(1).then(async (res) => {
          setData(res);
        });
        toast({
          title: `User with fullname: ${fullName} has been created successfully.`,
        });
      });
    } catch (err) {
      console.error("Failed to create user", err);
    }
  };

  const updateUserDetails = (userDetails: User) => {
    editUser(userDetails).then(async (res) => {
      const users: any = data.map((item: any) => {
        if (item.id === userDetails.id) {
          item.username = userDetails.username;
          item.fullName = userDetails.fullName;
        }
        return item;
      });
      setData([...users]);
      toast({
        title: `User has been updated successfully.`,
      });
      setIsOpen(false);
    });
  };

  useEscapeKey(() => setIsOpen(false));

  const [selectedRowDetails, setSelectedRowDetails] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mainTable">
      {data?.length ? (
        <div className="m-4">
          <div className="flex justify-start gap-2 items-center mt-2">
            <h1 className="text-2xl font-bold">All Users</h1>
            <Input
              placeholder="Filter by username or fullname..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="max-w-sm"
            />
            <Dialog>
              <DialogTrigger>
                <Button variant="outline" size="sm">
                  Create User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fill the user details</DialogTitle>
                  <DialogDescription>
                    Please fill all the details and upload a picture
                  </DialogDescription>
                  <p className="mb-3"></p>

                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="max-w-sm my-3 inputElem"
                  />
                  <p className="mb-2"></p>

                  <Input
                    placeholder="Fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="max-w-sm my-3 inputElem"
                  />
                  <p className="mb-2"></p>

                  <ImageUpload
                    onUpload={handleImageUpload}
                    uploadedImageUrl={avatar}
                  />
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      size={"sm"}
                      className="max-w-sm bg-slate-400 btn"
                      onClick={createNewUser}
                    >
                      Submit
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <DataTable columns={columns} data={data}></DataTable>
        </div>
      ) : (
        <></>
      )}
      {isOpen && (
        <Modal
          updateUser={updateUserDetails}
          userDetails={selectedRowDetails}
        ></Modal>
      )}

      <Chat />
    </div>
  );
}
