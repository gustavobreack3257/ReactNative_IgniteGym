import { ExerciseCard } from "@components/ExerceseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "@routes/app.routes";

import { HStack, VStack, FlatList, Heading, Text } from "native-base";
import React, { useState } from "react";
export function Home(){
    const [groupSelected, setGroupSelected] = useState('Costas')
    const [groups, setGroups] = useState(['Costas', 'Bespes', 'Triceps', 'Ombro' ])
    const [exercesses, setExercise] = useState(['Puxada Frontal', 'Remada curvada', 'Remada unilateral', 'levantamento terra'])

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleOpenExerciseDetails(){
        navigation.navigate("exercise")
    }
    return(
        <VStack flex={1}>
           <HomeHeader/>

           <FlatList
           data={groups}
           keyExtractor={item => item}
           renderItem={({item}) => (
            <Group
            name={item}
            isActivity={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}/>
           )}
            horizontal
            showsHorizontalScrollIndicator={false}
            _contentContainerStyle={{px: 8}}
            my={10}
            maxH={10}
            minH={10}
           />

           <VStack flex={1} px={8}>
           <HStack justifyContent='space-between' mb={5}>
            <Heading color='gray.200' fontFamily='heading' fontSize='md'>Exercícios</Heading>

            <Text color='gray.200' fontSize='sm'>
                 {exercesses.length}
            </Text>
           </HStack>

            <FlatList
            data={exercesses}
            keyExtractor={item => item}
            renderItem={({item}) => (
            <ExerciseCard onPress={handleOpenExerciseDetails}/>
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20}}
            />

           </VStack>
        </VStack>
    )
}