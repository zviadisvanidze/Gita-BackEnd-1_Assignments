#!/usr/bin/env node

import { Command } from 'commander';
import fetch from 'node-fetch'; 
import chalk from 'chalk';

const program = new Command();

program
  .name('weather-cli')
  .description('ამინდის გაგება ნებისმიერ ქალაქში')
  .argument('<cityName>', 'ქალაქი')
  .action(async (cityName) => {
    const apiKey = '895284fb2d2c50a520ea537456963d9c';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

    try {
        console.log(chalk.gray(`ამინდი ქალაქისთვის: ${cityName}...`));

        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                console.log(chalk.red.bold(`\n error: ქალაქი "${cityName}" ვერ მოიძებნა! გთხოვთ გადაამოწმოთ სახელი.\n`));
            } else {
                console.log(chalk.red(`\n მოხდა შეცდომა! სტატუსი: ${response.status}\n`));
            }
            return;
        }

        const data = await response.json();

        console.log(chalk.green.bold(`\n ამინდი ქალაქში: ${data.name}, ${data.sys.country}`));
        console.log(chalk.cyan(` ტემპერატურა: ${data.main.temp}°C`));
        console.log(chalk.cyan(` ქარის სიჩქარე: ${data.wind.speed} მ/წ`));
        console.log(chalk.cyan(`  აღწერა: ${data.weather[0].description}\n`));

    } catch (error) {
        console.log(chalk.red(`\n ქსელის შეცდომა: ${error.message}\n`));
    }
  });

program.parse(process.argv);