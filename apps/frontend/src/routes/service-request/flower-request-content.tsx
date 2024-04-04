import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import {
  addOnCards,
  flowerCards,
} from "@/routes/service-request/contentInfo.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ShoppingCart, X } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast.ts";
import { ToastAction } from "@/components/ui/toast";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Textarea } from "@/components/ui/textarea.tsx";
// import {CartTable} from "@/routes/service-request/CartTable.tsx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

export interface cartItem {
  cost: number;
  name: string;
}

export interface requestForm {
  cartItems: cartItem[];
  sender: string;
  recipient: string;
  location: string;
  message?: string;
  total: number;
}

export const FlowerContent = () => {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const totalCost = cartItems.reduce((sum, item) => sum + item.cost, 0);
  const [form, setForm] = useState<requestForm>({
    cartItems: cartItems,
    sender: "",
    recipient: "",
    location: "",
    total: totalCost,
  });

  const handleForm = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({
      ...prev,
      cartItems: cartItems,
      total: totalCost,
      [event.target.id]: event.target.value,
    }));
  };

  const { toast } = useToast();
  async function submit() {
    console.log(form);
    const res = await axios.post("/api/flowerReq", form, {
      headers: {
        "content-type": "Application/json",
      },
    });
    if (res.status == 200) {
      console.log("success");
    }
  }

  const onAddItem = (item: cartItem): void => {
    const prevItems = [...cartItems];
    setCartItems((prev) => [
      ...prev,
      {
        name: item.name,
        cost: item.cost,
      },
    ]);
    console.log(item.name);

    toast({
      title: `You added ${item.name} to cart!`,
      duration: 4000,
      description: "Would you like to undo?",
      action: (
        <ToastAction
          altText="Undo"
          onClick={() => {
            setCartItems(prevItems);
          }}
        >
          Undo
        </ToastAction>
      ),
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Flower Request
          </h2>
          <p className="text-sm text-muted-foreground">
            Send a loved one a special gift
          </p>
        </div>
        <div className="ml-auto mr-4">
          <Popover>
            <PopoverTrigger>
              <Button className={"px-5 mr-3"} variant={"outline"}>
                <ShoppingCart className={"mr-2 h-4 w-4"} />
                Cart
              </Button>
            </PopoverTrigger>
            <PopoverContent className={"w-100"}>
              <Table>
                <TableCaption>
                  <Dialog>
                    <Button
                      variant={"destructive"}
                      onClick={() => setCartItems([])}
                      className={" w-full mb-2"}
                    >
                      Empty cart
                    </Button>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Submission form</DialogTitle>
                        <DialogDescription>
                          Enter recipient's information below, then click submit
                          when done.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 pt-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="sender" className="text-right">
                            Sender's Name
                          </Label>
                          <Input
                            onChange={handleForm}
                            id="sender"
                            placeholder="Sender"
                            className="col-span-3"
                          />
                          <Label htmlFor="recipient" className="text-right">
                            Recipient's Name
                          </Label>
                          <Input
                            id="recipient"
                            onChange={handleForm}
                            placeholder="Recipient"
                            className="col-span-3"
                          />
                          <Label htmlFor="location" className="text-right">
                            Recipient's Location
                          </Label>
                          <Input
                            onChange={handleForm}
                            id="location"
                            placeholder="Location"
                            className="col-span-3"
                          />
                          <Label htmlFor="message" className="text-right">
                            Message to Recipient's (Optional)
                          </Label>
                          <Textarea
                            onChange={handleForm}
                            id="message"
                            placeholder="Message"
                            className="col-span-3"
                          />
                        </div>
                        <div
                          className={"flex text-center text-bold item-center"}
                        >
                          <h1 className={"text-right font-semibold text-xl"}>
                            Total Cost: $
                            {totalCost % 1 ? totalCost.toFixed(2) : totalCost}
                          </h1>
                        </div>
                        <DialogClose className={"w-full"}>
                          <Button
                            type="submit"
                            onClick={() => {
                              submit().then(() => {
                                setCartItems([]);
                              });
                            }}
                            className={"px-5 w-full"}
                          >
                            Send!
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                    <DialogTrigger asChild className={"w-full"}>
                      <Button variant="default">Submit Gift</Button>
                    </DialogTrigger>
                  </Dialog>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead> Name</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item: cartItem, index: number) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium ">
                        <Button
                          variant={"invisible"}
                          onClick={() => {
                            setCartItems(
                              cartItems.filter((item, i) => i !== index),
                            );
                          }}
                          className={
                            "text-center flex flex-col font-bold text-lg"
                          }
                        >
                          <X />
                        </Button>
                      </TableCell>
                      <TableCell className={" text-nowrap"}>
                        {item.name}
                      </TableCell>
                      <TableCell className="text-center items-end">
                        ${item.cost}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-center">
                      ${totalCost % 1 ? totalCost.toFixed(2) : totalCost}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4 my-3 ml-2">
            {flowerCards.map((flower) => (
              <Card
                className={
                  "lg-card justify-center shadow-none object-cover transition-all hover:scale-105 hover:shadow"
                }
              >
                <CardContent className={" w-[300px] mt-2"}>
                  <img
                    src={flower.image}
                    alt={flower.name}
                    className="h-64 mx-auto"
                  />
                  <CardTitle className={"text-center pt-2"}>
                    {flower.name}
                  </CardTitle>
                  <CardDescription
                    className={"text-center text-lg text-muted-foreground"}
                  >
                    ${flower.cost}
                  </CardDescription>
                  <CardDescription
                    className={
                      "text-center text-lg text-muted-foreground flex flex-col pt-2 items-center "
                    }
                  >
                    <Button
                      variant={"default"}
                      type={"button"}
                      onClick={() => onAddItem(flower)}
                    >
                      Add to cart
                    </Button>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Add-ons</h2>
        <p className="text-sm text-muted-foreground">
          Give something a little more
        </p>
      </div>
      <Separator className="my-4" />
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 my-3 pb-4 ml-2">
            {addOnCards.map((addon) => (
              <Card
                className={
                  "sm-card justify-center shadow-none object-cover transition-all hover:scale-105 hover:shadow"
                }
              >
                <CardContent className={"w-[300px] mt-2"}>
                  <img
                    src={addon.image}
                    alt={addon.name}
                    // width={"200px"}
                    className="h-64 mx-auto"
                  />
                  <CardTitle className={"text-center pt-2"}>
                    {addon.name}
                  </CardTitle>
                  <CardDescription
                    className={"text-center text-lg text-muted-foreground"}
                  >
                    ${addon.cost}
                  </CardDescription>
                  <CardDescription
                    className={
                      "text-center text-lg text-muted-foreground flex flex-col pt-2 items-center"
                    }
                  >
                    <Button
                      variant={"default"}
                      type={"button"}
                      onClick={() => onAddItem(addon)}
                    >
                      Add to cart
                    </Button>
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};
