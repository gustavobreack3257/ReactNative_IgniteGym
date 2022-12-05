import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { VStack } from "native-base";
import React from "react";

export function Home(){
    return(
        <VStack flex={1}>
           <HomeHeader/>

           <Group name='costas'/>
        </VStack>
    )
}