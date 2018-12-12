<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\BillingProduct;
use Illuminate\Http\Request;

class DataController extends Controller
{

    private $clientData = [];

    private $periodData = [
        'monthly' => 0,
        'quarterly' => 0,
        'annually' => 0,
    ];

    private $invoiced = 0;

    private $toInvoice = 0;

    private $colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6347', '#7CFC00', '#00FFFF', '#7B68EE', '#FF00FF', '#FF69B4', '#DAA520', '#008080',
        '#808000'];

    /**
     * Get all the data for the visualisation
     *
     * @param Request $request
     */
    public function getData(Request $request)
    {
        $this->from = Carbon::createFromFormat('m-d-Y', $request->input('from'));
        $this->to = Carbon::createFromFormat('m-d-Y', $request->input('to'));

        $this->processData(BillingProduct::all());

        $data = new \stdClass();
        $data->almostFinished = $this->getAlmostFinished();
        $data->invoiced = $this->invoiced;
        $data->notInvoiced = $this->toInvoice;
        $data->invoiceDistribution = $this->formatPeriodData();
        $data->clientDistribution = $this->formatClientData();

        return json_encode($data);
    }

    /**
     * Get 5 closest contracts to expiration date
     *
     * @return Collection
     */
    private function getAlmostFinished()
    {
        return BillingProduct::whereNotNull('expiration_date')
            ->orderBy('expiration_date', 'asc')
            ->limit(5)
            ->get();
    }

    private function formatClientData()
    {
        $data2 = [];
        $i = 0;

        foreach ($this->clientData as $client => $data) {
            $item = new \stdClass();
            $item->name = $client;
            $item->value = $data;
//            $item->fill = $this->colors[$i];
            $i++;
            $data2[] = $item;
        }

        \usort($data2, function($a, $b) {
            return $b->value - $a->value;
        });

        return $data2;
    }

    private function formatPeriodData()
    {
        $data2 = [];
        $i = 0;

        foreach ($this->periodData as $period => $data) {
            $item = new \stdClass();
            $item->name = $period;
            $item->value = $data;
//            $item->fill = $this->colors[$i];
            $i++;
            $data2[] = $item;
        }

        \usort($data2, function($a, $b) {
            return $b->value - $a->value;
        });

        return $data2;
    }

    private function processData($products)
    {
        foreach ($products as $product) {
            switch ($product->billing_interval) {
                case 'monthly':
                    $this->handleMonth($product);
                    break;
                case 'quarterly':
                    $this->handleQuarter($product);
                    break;
                case 'annually':
                    $this->handleYear($product);
                    break;
            }
        }
    }

    private function handleMonth($product)
    {
        $clientKey = 'client_' . $product->client_id;
        $lastBilled = Carbon::createFromFormat('Y-m-d', $product->billing_last);
        $invoiced = $lastBilled->diffInMonths($this->from) * $product->price;
        $toInvoice = ($lastBilled->diffInMonths($this->to)) * $product->price;
        $value = $invoiced + $toInvoice;

        $this->invoiced += $invoiced;
        $this->toInvoice += $toInvoice;

        $this->periodData['monthly'] += $value;
        $this->handleClientValue($clientKey, $value);
    }

    private function handleQuarter($product)
    {
        $clientKey = 'client_' . $product->client_id;
        $lastBilled = Carbon::createFromFormat('Y-m-d', $product->billing_last);
        $invoiced = \floor(($lastBilled->diffInMonths($this->from)) / 3) * $product->price;
        $toInvoice = (\floor($lastBilled->diffInMonths($this->to) / 3)) * $product->price;
        $value = $invoiced + $toInvoice;

        $this->invoiced += $invoiced;
        $this->toInvoice += $toInvoice;

        $this->periodData['quarterly'] += $value;
        $this->handleClientValue($clientKey, $value);
    }

    private function handleYear($product)
    {
        $clientKey = 'client_' . $product->client_id;
        $lastBilled = Carbon::createFromFormat('Y-m-d', $product->billing_last);
        $invoiced = \floor(($lastBilled->diffInYears($this->from))) * $product->price;
        $toInvoice = (\floor($lastBilled->diffInYears($this->to) + 1)) * $product->price;
        $value = $invoiced + $toInvoice;

        $this->invoiced += $invoiced;
        $this->toInvoice += $toInvoice;

        $this->periodData['annually'] += $value;
        $this->handleClientValue($clientKey, $value);
    }

    private function handleClientValue($clientKey, $value)
    {
        if (\array_key_exists($clientKey, $this->clientData)) {
            $this->clientData[$clientKey] += $value;
        } else {
            $this->clientData[$clientKey] = $value;
        }
    }

    private function customArraySort($a, $b)
    {
        return $a->value - $b->value;
    }
}
